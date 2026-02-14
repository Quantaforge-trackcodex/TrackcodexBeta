
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_DIR = path.join(__dirname, '..', '.vscode_engine');
const ZIP_PATH = path.join(OUT_DIR, 'code-server.zip');
const FINAL_BIN_DIR = path.join(OUT_DIR, 'code-server-bin');

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function install() {
    try {
        console.log('Fetching latest release info...');
        const apiRes = await fetch('https://api.github.com/repos/coder/code-server/releases/latest');
        if (!apiRes.ok) throw new Error(`API failed: ${apiRes.statusText}`);

        const release = await apiRes.json();
        const asset = release.assets.find(a => a.name.includes('windows-amd64.zip'));

        if (!asset) {
            throw new Error('No windows-amd64.zip asset found in latest release');
        }

        console.log(`Found asset: ${asset.name}`);
        console.log(`URL: ${asset.browser_download_url}`);

        await download(asset.browser_download_url);
        extract(asset.name.replace('.zip', ''));
    } catch (err) {
        console.error('Installation failed:', err.message);
        process.exit(1);
    }
}

async function download(url) {
    console.log(`Downloading...`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);

    const fileStream = fs.createWriteStream(ZIP_PATH);
    // @ts-ignore
    await finished(Readable.fromWeb(response.body).pipe(fileStream));
    console.log('Download complete.');
}

function extract(folderName) {
    const EXTRACT_DIR = path.join(OUT_DIR, folderName);
    console.log('Extracting...');
    try {
        // Use tar
        execSync(`tar -xf "${ZIP_PATH}" -C "${OUT_DIR}"`);

        console.log('Setting up binary directory...');
        if (fs.existsSync(FINAL_BIN_DIR)) {
            fs.rmSync(FINAL_BIN_DIR, { recursive: true, force: true });
        }

        if (fs.existsSync(EXTRACT_DIR)) {
            fs.renameSync(EXTRACT_DIR, FINAL_BIN_DIR);
            console.log(`Renamed ${EXTRACT_DIR} to ${FINAL_BIN_DIR}`);
        } else {
            // Fallback: search for extracted dir if name mismatch
            const dirs = fs.readdirSync(OUT_DIR).filter(d => d.startsWith('code-server-') && fs.statSync(path.join(OUT_DIR, d)).isDirectory());
            if (dirs.length > 0) {
                fs.renameSync(path.join(OUT_DIR, dirs[0]), FINAL_BIN_DIR);
                console.log(`Renamed ${dirs[0]} to ${FINAL_BIN_DIR}`);
            } else {
                throw new Error(`Extraction failed, expected folder ${folderName} or similar not found`);
            }
        }

        // Cleanup
        if (fs.existsSync(ZIP_PATH)) fs.unlinkSync(ZIP_PATH);

        console.log('✅ Success! code-server installed.');

    } catch (err) {
        console.error('Extraction/Setup failed:', err.message);
        process.exit(1);
    }
}

install();
