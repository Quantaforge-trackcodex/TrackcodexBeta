
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkRelease() {
    try {
        console.log('Fetching v4.96.4 release info...');
        const apiRes = await fetch('https://api.github.com/repos/coder/code-server/releases/tags/v4.96.4');
        if (!apiRes.ok) throw new Error(`API failed: ${apiRes.statusText}`);

        const release = await apiRes.json();
        console.log(`Release: ${release.tag_name}`);
        console.log('Assets:');
        release.assets.forEach(a => console.log(` - ${a.name}`));
    } catch (err) {
        console.error('Check failed:', err.message);
    }
}

checkRelease();
