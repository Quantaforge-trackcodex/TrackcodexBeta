import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3001/api/v1/forge/terminal/default');

ws.on('open', () => {
    console.log('✅ Connected to Forge Terminal');
    setTimeout(() => {
        ws.send('ls\n');
    }, 1000);
});

ws.on('message', (data) => {
    console.log('📩 Message from server:', data.toString());
});

ws.on('error', (err) => {
    console.error('❌ Connection Error:', err.message);
});

ws.on('close', (code, reason) => {
    console.log(`🔌 Closed: ${code} - ${reason}`);
    process.exit();
});

setTimeout(() => {
    console.log('⏰ Timeout reached');
    process.exit();
}, 5000);
