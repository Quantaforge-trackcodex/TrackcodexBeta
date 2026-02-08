/**
 * VS Code Theming Injection Script
 *
 * This script injects TrackCodex branding into VS Code Web
 * To be loaded via postMessage after iframe loads
 */

export const injectTrackCodexTheme = () => {
  const customCSS = `
    /* TrackCodex IDE Custom Theme */
    
    /* Override VS Code colors with TrackCodex purple/cyan */
    :root {
      --vscode-activityBar-background: #0a0a0f !important;
      --vscode-activityBar-foreground: #8b5cf6 !important;
      --vscode-activityBar-activeBorder: #8b5cf6 !important;
      --vscode-activityBar-inactiveForeground: #6b7280 !important;
      
      --vscode-sideBar-background: #0f0f17 !important;
      --vscode-sideBar-foreground: #e5e7eb !important;
      --vscode-sideBar-border: #2d1b4e33 !important;
      
      --vscode-editor-background: #0a0a0f !important;
      --vscode-editor-foreground: #e5e7eb !important;
      --vscode-editorCursor-foreground: #8b5cf6 !important;
      --vscode-editor-selectionBackground: #8b5cf633 !important;
      --vscode-editor-lineHighlightBackground: #8b5cf611 !important;
      
      --vscode-statusBar-background: linear-gradient(90deg, #8b5cf6, #06b6d4) !important;
      --vscode-statusBar-foreground: #ffffff !important;
      --vscode-statusBar-border: transparent !important;
      
      --vscode-button-background: #8b5cf6 !important;
      --vscode-button-hoverBackground: #7c3aed !important;
      --vscode-button-foreground: #ffffff !important;
      
      --vscode-focusBorder: #8b5cf6 !important;
      --vscode-input-background: #1a1a2e !important;
      --vscode-input-foreground: #e5e7eb !important;
      --vscode-input-border: #2d1b4e !important;
      
      --vscode-list-activeSelectionBackground: #8b5cf622 !important;
      --vscode-list-activeSelectionForeground: #8b5cf6 !important;
      --vscode-list-hoverBackground: #8b5cf611 !important;
      
      --vscode-terminal-ansiMagenta: #8b5cf6 !important;
      --vscode-terminal-ansiCyan: #06b6d4 !important;
    }
    
    /* TrackCodex gradient accents */
    .monaco-workbench .part.activitybar > .content {
      background: linear-gradient(180deg, #0a0a0f 0%, #1a0f2e 100%) !important;
      border-right: 1px solid rgba(139, 92, 246, 0.2) !important;
    }
    
    .monaco-workbench .part.statusbar {
      background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 50%, #06b6d4 100%) !important;
      color: white !important;
      font-weight: 500 !important;
    }
    
    /* TrackCodex glow effects */
    .monaco-workbench .activitybar .badge {
      background: linear-gradient(135deg, #8b5cf6, #06b6d4) !important;
      box-shadow: 0 0 12px rgba(139, 92, 246, 0.6) !important;
    }
    
    /* Command Palette branding */
    .quick-input-widget {
      background: #0a0a0f !important;
      border: 1px solid #8b5cf6 !important;
      box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3) !important;
    }
    
    .quick-input-title {
      background: linear-gradient(90deg, #8b5cf6, #06b6d4) !important;
      color: white !important;
    }
    
    /* Scrollbar theming */
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #8b5cf6, #06b6d4) !important;
      border-radius: 4px !important;
    }
    
    ::-webkit-scrollbar-track {
      background: #1a1a2e !important;
    }
    
    /* Tab styling */
    .monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab {
      background: #0a0a0f !important;
      border-right: 1px solid #2d1b4e33 !important;
    }
    
    .monaco-workbench .part.editor > .content .editor-group-container > .title .tabs-container > .tab.active {
      background: linear-gradient(180deg, #8b5cf622 0%, transparent 100%) !important;
      border-top: 2px solid #8b5cf6 !important;
      color: #8b5cf6 !important;
    }
    
    /* Minimap accent */
    .minimap {
      background: #0f0f17 !important;
      border-left: 1px solid #2d1b4e33 !important;
    }
    
    /* Settings UI */
    .settings-editor > .settings-body .settings-tree-container {
      background: #0a0a0f !important;
    }
    
    /* TrackCodex Loading Screen */
    .monaco-workbench.starting .monaco-workbench-container {
      background: #0a0a0f !important;
    }
  `;

  return customCSS;
};

/**
 * TrackCodex logo SVG for injection
 */
export const trackCodexLogoSVG = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="trackcodex-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#trackcodex-gradient)" opacity="0.2"/>
    <path d="M7 6h10v2H9v10H7V6z M17 8v10h-8v-2h6V8h2z" fill="url(#trackcodex-gradient)"/>
  </svg>
`;

/**
 * Configure VS Code settings for TrackCodex branding
 */
export const trackCodexVSCodeSettings = {
  "workbench.colorTheme": "TrackCodex Dark",
  "workbench.productIconTheme": "TrackCodex Icons",
  "workbench.colorCustomizations": {
    "activityBar.background": "#0a0a0f",
    "activityBar.foreground": "#8b5cf6",
    "activityBar.activeBorder": "#8b5cf6",
    "activityBar.inactiveForeground": "#6b7280",
    "statusBar.background": "#8b5cf6",
    "statusBar.foreground": "#ffffff",
    "sideBar.background": "#0f0f17",
    "editor.background": "#0a0a0f",
    "terminal.background": "#0a0a0f",
    "panel.background": "#0f0f17",
  },
  "window.titleBarStyle": "custom",
  "window.title": "TrackCodex IDE - ${activeEditorShort}",
  "extensions.autoUpdate": false,
  "extensions.ignoreRecommendations": false,
  "telemetry.telemetryLevel": "off",
};
