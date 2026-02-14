
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
// Target the new code-server installation
const CODE_SERVER_DIR = path.join(ROOT_DIR, 'vscode-engine', 'node_modules', 'code-server');
const VSCODE_LIB_DIR = path.join(CODE_SERVER_DIR, 'lib', 'vscode');

async function rebrandIDE() {
    console.log('🎨 Starting IDE Rebranding (Code-Server Edition) to TrackCodex...');

    if (!fs.existsSync(CODE_SERVER_DIR)) {
        console.error('❌ vscode-engine/node_modules/code-server not found. Please run yarn install first.');
        process.exit(1);
    }

    const vscodePath = VSCODE_LIB_DIR;
    console.log(`📂 Found VS Code installation: ${vscodePath}`);

    // Files to patch
    const filesToPatch = [
        path.join(vscodePath, 'out', 'nls.messages.js'),
        path.join(vscodePath, 'out', 'vs', 'code', 'browser', 'workbench', 'workbench.html'),
        path.join(vscodePath, 'package.json'),
        path.join(vscodePath, 'product.json')
    ];

    // 1. Initial targeted patching
    for (const file of filesToPatch) {
        if (fs.existsSync(file)) {
            console.log(`✏️ Patching ${path.relative(ROOT_DIR, file)}...`);
            let content = fs.readFileSync(file, 'utf-8');
            let originalLength = content.length;
            let isJson = file.endsWith('.json');

            if (isJson) {
                try {
                    let json = JSON.parse(content);
                    if (file.endsWith('package.json')) {
                        json.name = "trackcodex";
                        json.displayName = "TrackCodex";
                        json.description = "TrackCodex IDE";
                        json.publisher = "Quantaforze LLC";
                    }
                    if (file.endsWith('product.json')) {
                        json.nameShort = "TrackCodex";
                        json.nameLong = "TrackCodex";
                        json.applicationName = "trackcodex";
                        json.dataFolderName = ".trackcodex";
                        json.extensionsGallery = {
                            serviceUrl: "http://localhost:3001/api/gallery", // Corrected port to 3001
                            itemUrl: "https://open-vsx.org/vscode/item",
                            controlUrl: "",
                            recommendationsUrl: ""
                        };
                        json.linkProtectionTrustedDomains = ["localhost", "127.0.0.1"];
                    }
                    content = JSON.stringify(json, null, 2);
                } catch (e) {
                    console.error(`Error parsing JSON ${file}:`, e);
                }
            } else {
                // String replacements
                content = content.replace(/Visual Studio Code/g, 'TrackCodex');
                content = content.replace(/VS Code/g, 'TrackCodex');
                content = content.replace(/Code - OSS/g, 'TrackCodex');
                content = content.replace(/Code - Insiders/g, 'TrackCodex');
                content = content.replace(/"name": "Code"/g, '"name": "TrackCodex"');
                content = content.replace(/"name": "Code - Insiders"/g, '"name": "TrackCodex"');
                content = content.replace(/Microsoft Corporation/g, 'Quantaforze LLC');

                // HTML Title specific
                if (file.endsWith('workbench.html')) {
                    content = content.replace('<meta name="apple-mobile-web-app-title" content="Code">', '<meta name="apple-mobile-web-app-title" content="TrackCodex">');
                    content = content.replace('<title>Code</title>', '<title>TrackCodex</title>');
                }
            }

            if (content.length !== originalLength || isJson) {
                // First write replacements
                // Then inject script if needed (to avoid replacements changing the script)
                if (file.endsWith('workbench.html') && !content.includes('TrackCodex: Dynamic UI Patching')) {
                    const injection = `
    <style>
        /* TrackCodex: Hide redundant gear menu items */
        .monaco-menu .action-menu-item[aria-label^="Settings"],
        .monaco-menu .action-menu-item[aria-label^="Extensions"],
        .monaco-menu .action-menu-item[aria-label^="Keyboard Shortcuts"],
        .monaco-menu .action-menu-item[aria-label^="Themes"],
        .monaco-menu .action-menu-item[aria-label^="Command Palette"] {
            display: none !important;
        }
    </style>
    <script>
        // TrackCodex: Redirect Extension Gallery & UI Patching
        (function() {
            try {
                // Config Override (if product.json fails)
                const meta = document.getElementById('vscode-workbench-web-configuration');
                if (meta) {
                    const rawSettings = meta.getAttribute('data-settings');
                    if (rawSettings) {
                        let settings = JSON.parse(rawSettings);
                        settings.productConfiguration = settings.productConfiguration || {};
                        
                        settings.productConfiguration.nameShort = "TrackCodex";
                        settings.productConfiguration.nameLong = "TrackCodex";
                        settings.productConfiguration.applicationName = "trackcodex";
                        settings.productConfiguration.extensionsGallery = {
                            serviceUrl: window.location.protocol + '//' + window.location.hostname + ':3001/api/gallery',
                            itemUrl: "https://open-vsx.org/vscode/item",
                            controlUrl: "",
                            recommendationsUrl: ""
                        };
                        meta.setAttribute('data-settings', JSON.stringify(settings));
                        console.log('✅ TrackCodex: Product Configuration Overridden');
                    }
                }
            } catch (e) {
                console.error('❌ TrackCodex: Failed to patch config.', e);
            }

            // TrackCodex: Dynamic UI Patching (MutationObserver with Shadow DOM Support)
            try {
                const sanitizeNode = (node) => {
                    if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
                        if (node.nodeValue.includes('Visual Studio Code') || 
                            node.nodeValue.includes('VS Code') ||
                            node.nodeValue.includes('Code - OSS')) {
                            node.nodeValue = node.nodeValue
                                .replace(/Visual Studio Code/g, "TrackCodex")
                                .replace(/VS Code/g, "TrackCodex")
                                .replace(/Code - OSS/g, "TrackCodex");
                        }
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.shadowRoot) {
                            observeRoot(node.shadowRoot);
                        }
                        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
                        let textNode;
                        while(textNode = walker.nextNode()) {
                            sanitizeNode(textNode);
                        }
                    }
                };

                const observeRoot = (root) => {
                    const observer = new MutationObserver((mutations) => {
                        for (const mutation of mutations) {
                            if (mutation.type === 'childList') {
                                mutation.addedNodes.forEach(sanitizeNode);
                            } else if (mutation.type === 'characterData') {
                                sanitizeNode(mutation.target);
                            }
                        }
                    });
                    observer.observe(root, { childList: true, subtree: true, characterData: true });
                };

                const originalAttachShadow = Element.prototype.attachShadow;
                Element.prototype.attachShadow = function(init) {
                    const shadowRoot = originalAttachShadow.call(this, init);
                    observeRoot(shadowRoot);
                    return shadowRoot;
                };

                observeRoot(document.body);
                console.log('✅ TrackCodex: Advanced UI MutationObserver (Shadow DOM) Active');

                // TrackCodex: Remote Command Execution
                window.addEventListener('message', (event) => {
                    const { type, payload } = event.data;
                    if (type === 'run-command' && payload.command) {
                        console.log('🚀 TrackCodex: Executing remote command:', payload.command);
                        // Using internal VS Code workbench command service if available
                        // Or try to use the global command trigger
                        try {
                            if (window.require) {
                                const commandService = window.require('vs/platform/commands/common/commands').ICommandService;
                                if (window.vscode && window.vscode.commands) {
                                    window.vscode.commands.executeCommand(payload.command);
                                } else {
                                    // Fallback: Dispatch a key event or try to find the service in the registry
                                    console.warn('⚠️ TrackCodex: Global vscode object not found, attempting alternate execution...');
                                    // Most reliable way in code-server is to use the existing message bus if we can
                                    // But for now, let's try a simpler approach by dispatching a custom event that extension might listen to
                                    // Or just use the URL if it's an initial load command
                                }
                            }
                        } catch (e) {
                            console.error('❌ TrackCodex: Failed to execute remote command.', e);
                        }
                    }
                });

            } catch (e) {
                console.error('❌ TrackCodex: Failed to start Advanced MutationObserver', e);
            }
        })();
    </script>
    </body>`;
                    content = content.replace('</body>', injection);
                }

                fs.writeFileSync(file, content, 'utf-8');
                console.log('   ✅ Patched.');
            } else {
                console.log('   ℹ️ No changes needed or already patched.');
            }

        } else {
            console.warn(`⚠️ File not found: ${file}`);
        }
    }

    // 2. Aggressive Recursive Search and Replace
    function getAllFiles(dirPath, arrayOfFiles) {
        let files = fs.readdirSync(dirPath);
        arrayOfFiles = arrayOfFiles || [];

        files.forEach(function (file) {
            const fullPath = path.join(dirPath, file);
            if (fs.statSync(fullPath).isDirectory()) {
                if (file !== 'node_modules') { // Skip node_modules inside lib (if any)
                    arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
                }
            } else {
                arrayOfFiles.push(fullPath);
            }
        });

        return arrayOfFiles;
    }

    console.log('🔍 Scanning all files for branding strings (Extension/Aggressive)...');
    const allFiles = getAllFiles(path.join(vscodePath, 'out')); // Only scan out folder to be safe
    let patchCount = 0;

    for (const file of allFiles) {
        const ext = path.extname(file).toLowerCase();
        if (!['.js', '.json', '.html', '.css', '.md', '.txt', '.ts', '.yml', '.xml'].includes(ext)) {
            continue;
        }

        try {
            let content = fs.readFileSync(file, 'utf-8');
            let modified = false;

            const replacements = [
                { reg: /Visual Studio Code/g, val: 'TrackCodex' },
                { reg: /VS Code/g, val: 'TrackCodex' },
                { reg: /Code - OSS/g, val: 'TrackCodex' },
                { reg: /Code - Insiders/g, val: 'TrackCodex' },
                { reg: /Microsoft Corporation/g, val: 'Quantaforze LLC' },
                // Specific hardcoded strings in code-server
                { reg: /"code-server"/g, val: '"track-codex-server"' },
            ];

            for (const rep of replacements) {
                if (content.match(rep.reg)) {
                    content = content.replace(rep.reg, rep.val);
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(file, content, 'utf-8');
                // console.log(`   ✅ Patched: ${path.relative(ROOT_DIR, file)}`); // Quiet mode
                patchCount++;
            }

        } catch (e) {
            // Ignore read errors
        }
    }
    // 3. Logo Replacement
    console.log('🖼️ Replacing icons with official TrackCodex logo...');
    const logoSource = path.join(ROOT_DIR, 'official-logo.png');
    const mediaDir = path.join(CODE_SERVER_DIR, 'src', 'browser', 'media');

    if (fs.existsSync(logoSource)) {
        const iconTargets = [
            path.join(mediaDir, 'favicon.ico'),
            path.join(mediaDir, 'favicon.svg'), // Note: replacing .svg with .png content might need browser to be lenient
            path.join(mediaDir, 'pwa-icon-192.png'),
            path.join(mediaDir, 'pwa-icon-512.png'),
            path.join(mediaDir, 'pwa-icon-maskable-192.png'),
            path.join(mediaDir, 'pwa-icon-maskable-512.png'),
        ];

        for (const target of iconTargets) {
            try {
                fs.copyFileSync(logoSource, target);
                console.log(`   ✅ Replaced: ${path.relative(ROOT_DIR, target)}`);
            } catch (e) {
                console.error(`   ❌ Failed to replace ${target}:`, e);
            }
        }
    } else {
        console.warn('⚠️ Official logo not found at root. Skipping icon replacement.');
    }

    console.log('🎉 Rebranding complete! Launch with scripts/serve-code-server.js');
}

rebrandIDE();
