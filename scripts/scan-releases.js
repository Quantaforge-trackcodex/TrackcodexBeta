
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

async function scanReleases() {
    try {
        console.log('Scanning releases for windows-amd64...');
        let page = 1;
        let found = false;

        while (page <= 3 && !found) {
            const apiRes = await fetch(`https://api.github.com/repos/coder/code-server/releases?page=${page}&per_page=10`);
            if (!apiRes.ok) throw new Error(`API failed: ${apiRes.statusText}`);

            const releases = await apiRes.json();
            for (const r of releases) {
                const asset = r.assets.find(a => a.name.includes('windows-amd64'));
                if (asset) {
                    console.log(`✅ Found supported release: ${r.tag_name}`);
                    console.log(`   URL: ${asset.browser_download_url}`);
                    found = true;
                    return;
                } else {
                    console.log(`Checking ${r.tag_name}... No Windows binaries.`);
                }
            }
            page++;
        }

        if (!found) console.log('❌ No Windows releases found in recent history.');

    } catch (err) {
        console.error('Scan failed:', err.message);
    }
}

scanReleases();
