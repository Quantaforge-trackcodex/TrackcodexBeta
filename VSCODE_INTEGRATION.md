# VS Code OSS Integration for TrackCodex

This directory contains the VS Code Open Source integration for TrackCodex IDE.

## Overview

TrackCodex embeds VS Code Web (OSS, MIT-licensed) to provide a full-featured IDE experience:

- ✅ **Real VS Code** - Not a clone or simulator
- ✅ **OpenVSX Extensions** - Full extension marketplace access
- ✅ **Language Servers** - TypeScript, Python, and more
- ✅ **Debugging** - Full DAP (Debug Adapter Protocol) support
- ✅ **Integrated Terminal** - Native terminal with workspace isolation
- ✅ **Git Integration** - Full SCM capabilities
- ✅ **TrackCodex Branding** - Custom product configuration

## Architecture

```
TrackCodex Desktop App
├── Electron Shell (main process)
├── Backend Server (Fastify, port 4000)
│   └── VS Code Workspace Provider
├── VS Code Web Server (Express, port 8080)
│   └── Serves compiled VS Code OSS
└── React App (Vite, port 3000)
    └── VSCodeWebBridge component
        └── <iframe src="localhost:8080" />
```

## Quick Start

### 1. Build VS Code Web (First Time Only)

```bash
npm run build:vscode
```

**This will:**

- Install VS Code OSS dependencies (~5-10 min)
- Apply TrackCodex branding
- Compile VS Code Web (~10-30 min on first run)

**Note:** Subsequent builds are much faster (<5 min)

### 2. Run TrackCodex with VS Code IDE

```bash
npm run dev:desktop
```

This starts:

1. Backend API server (port 4000)
2. VS Code Web server (port 8080)
3. React frontend (port 3000)
4. Electron desktop app

## Components

### Product Configuration

**File:** `.vscode_engine/product.trackcodex.json`

TrackCodex-branded VS Code configuration:

- Product name: "TrackCodex IDE"
- Application ID: `trackcodex-ide`
- OpenVSX marketplace integration
- Telemetry disabled
- Microsoft services removed

### Build Script

**File:** `scripts/build-vscode-web.js`

Automated VS Code Web builder:

- Applies TrackCodex branding
- Installs dependencies
- Compiles VS Code Web
- Handles product.json replacement

### VS Code Web Server

**File:** `scripts/serve-vscode-web.js`

Development server for VS Code Web:

- Serves compiled VS Code on port 8080
- CORS configured for localhost:3000
- Security headers for iframe embedding
- Workspace configuration endpoints

### React Bridge Component

**File:** `components/ide/VSCodeWebBridge.tsx`

React component that embeds VS Code Web:

- Iframe rendering
- postMessage communication
- Workspace switching
- Error handling
- Loading states

### Workspace Provider

**File:** `backend/services/vscode-workspace-provider.ts`

Backend service for file system access:

- Workspace registration
- File read/write operations
- Directory listing
- Path traversal protection
- API routes for VS Code

## Development Workflow

### Watch Mode

```bash
# Terminal 1: Watch VS Code Web changes
npm run watch:vscode

# Terminal 2: Run TrackCodex
npm run dev:desktop
```

### Rebuild VS Code

```bash
npm run build:vscode
```

### Serve VS Code Only

```bash
npm run serve:vscode
```

## File Structure

```
meeting_1/
├── .vscode_engine/              # VS Code OSS source
│   ├── product.json             # Active product config
│   ├── product.trackcodex.json  # TrackCodex branding
│   ├── out-vscode-web/          # Compiled VS Code Web
│   └── ...                      # VS Code source files
│
├── scripts/
│   ├── build-vscode-web.js      # VS Code build script
│   └── serve-vscode-web.js      # VS Code dev server
│
├── components/ide/
│   └── VSCodeWebBridge.tsx      # VS Code iframe component
│
├── backend/services/
│   └── vscode-workspace-provider.ts  # Workspace file system
│
└── package.json                 # Updated with VS Code scripts
```

## Environment

### Ports

| Service        | Port | Purpose            |
| -------------- | ---- | ------------------ |
| React Frontend | 3000 | TrackCodex UI      |
| Backend API    | 4000 | Fastify server     |
| VS Code Web    | 8080 | VS Code OSS server |

### URLs

- **TrackCodex Main:** http://localhost:3000
- **VS Code Web:** http://localhost:8080
- **Backend API:** http://localhost:4000

## Features

### IDE Capabilities

- ✅ **Multi-cursor editing**
- ✅ **IntelliSense** (autocomplete)
- ✅ **Go to definition**
- ✅ **Refactoring**
- ✅ **Code formatting**
- ✅ **Syntax highlighting**
- ✅ **Minimap**
- ✅ **Command palette** (Ctrl+Shift+P)
- ✅ **Integrated terminal**
- ✅ **Git integration**
- ✅ **Debugging** (DAP protocol)
- ✅ **Extensions** (from OpenVSX)

### Language Support

Built-in support for:

- TypeScript/JavaScript
- Python
- HTML/CSS
- JSON
- Markdown
- YAML
- Dockerfile
- Shell scripts

Additional languages via OpenVSX extensions.

## Legal & Licensing

### VS Code OSS

- **License:** MIT
- **Copyright:** Microsoft Corporation
- **Source:** https://github.com/microsoft/vscode

### TrackCodex Modifications

- **License:** MIT
- **Copyright:** Quantaforge LLC
- **Attribution:** Preserved in VSCODE_LICENSE.txt

### Compliance

✅ Uses VS Code Open Source (MIT)
✅ No Microsoft branding
✅ No Microsoft telemetry
✅ No Microsoft extension marketplace
✅ OpenVSX only
✅ MIT license headers preserved

## Troubleshooting

### Build fails

```bash
# Clean install VS Code dependencies
cd .vscode_engine
rm -rf node_modules
npm install
cd ..
npm run build:vscode
```

### VS Code Web won't load

1. Check if server is running:

   ```bash
   curl http://localhost:8080/health
   ```

2. Rebuild VS Code Web:

   ```bash
   npm run build:vscode
   ```

3. Check console for errors in browser DevTools

### Extensions won't install

1. Verify OpenVSX configuration in product.json
2. Check network connection
3. Try different extension from OpenVSX.org

### File system access denied

1. Check workspace is registered in backend
2. Verify workspace path exists
3. Check console for path traversal errors

## Performance

### Build Times

| Task         | First Run     | Subsequent |
| ------------ | ------------- | ---------- |
| Dependencies | 5-10 min      | <1 min     |
| Compilation  | 10-30 min     | 2-5 min    |
| **Total**    | **15-40 min** | **<5 min** |

### Runtime Performance

- **Startup:** <3 seconds to VS Code UI
- **File open:** <1 second for 10MB files
- **Extension install:** ~5-30 seconds
- **Memory:** ~200-300MB for VS Code Web

## Production Build

### Bundle VS Code Web

```bash
npm run build:vscode
npm run build
npm run dist
```

Output includes VS Code Web in installer.

### Distribution

VS Code Web is bundled into TrackCodex installer:

- **Location:** `dist/resources/.vscode_engine/out-vscode-web`
- **Size:** ~100MB
- **Served by:** Electron backend on localhost

## Updates

### Update VS Code OSS

```bash
cd .vscode_engine
git fetch origin
git checkout <version-tag>  # e.g., 1.85.0
cd ..
npm run build:vscode
```

### Version Pinning

Current VS Code version: **1.109.0**

To update, edit `.vscode_engine/package.json` version field.

## Support

- **TrackCodex Issues:** https://github.com/Quantaforge-trackcodex/issues
- **VS Code OSS:** https://github.com/microsoft/vscode
- **OpenVSX:** https://open-vsx.org

## Contributing

When modifying VS Code integration:

1. Keep product.trackcodex.json in sync
2. Test extensions from OpenVSX
3. Verify telemetry disabled
4. Update documentation
5. Test in production build

---

**Built with ❤️ by Quantaforge LLC**
**Powered by VS Code Open Source (MIT License)**
