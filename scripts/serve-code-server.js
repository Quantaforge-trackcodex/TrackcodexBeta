
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Path to our local code-server installation
const CODE_SERVER_ENTRY = path.join(ROOT_DIR, 'vscode-engine', 'node_modules', 'code-server', 'out', 'node', 'entry.js');

const args = [
    CODE_SERVER_ENTRY,
    '--auth', 'none',
    '--bind-addr', '0.0.0.0:8080',
    '--disable-telemetry',
    '--disable-update-check',
    // Open the current directory
    ROOT_DIR
];

console.log(`🚀 Starting TrackCodex Server (code-server edition)...`);
console.log(`Command: node ${args.join(' ')}`);

const server = spawn('node', args, {
    stdio: 'inherit',
    cwd: ROOT_DIR,
    env: { ...process.env, NODE_ENV: 'development' }
});

server.on('error', (err) => {
    console.error('❌ Failed to start code-server:', err);
});

server.on('close', (code) => {
    if (code !== 0) {
        console.error(`❌ code-server exited with code ${code}`);
    } else {
        console.log('✅ code-server stopped gracefully.');
    }
});
