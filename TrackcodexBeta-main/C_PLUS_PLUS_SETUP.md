# C++ Build Tools Installation Guide

To build native Node.js modules or Electron applications on Windows, you typically need the **Visual Studio Build Tools**.

## Option 1: Automatic Installation (Recommended)

You can often install the necessary tools using npm from an administrative PowerShell terminal.

1.  Open PowerShell as **Administrator** (Right-click Start > Terminal (Admin) / PowerShell (Admin)).
2.  Run the following command:
    ```powershell
    npm install --global --production windows-build-tools
    ```
    _Note: This process can take a while as it downloads and installs Python and Visual Studio Build Tools silently._

## Option 2: Manual Installation (More Reliable)

If the automatic method hangs or fails, follow these steps:

1.  **Download Build Tools**:
    - Go to the [Visual Studio Downloads page](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022).
    - Scroll down to "All Downloads" > "Tools for Visual Studio 2022".
    - Download **Build Tools for Visual Studio 2022**.

2.  **Run the Installer**:
    - Launch the downloaded executable (`vs_buildtools.exe`).
    - Wait for the Visual Studio Installer to load.

3.  **Select Workloads**:
    - In the "Workloads" tab, check **Desktop development with C++**.
    - Ensure the "Installation details" (right sidebar) includes:
      - **MSVC v143 - VS 2022 C++ x64/x86 build tools** (or latest version)
      - **Windows 11 SDK** (or Windows 10 SDK)

4.  **Install**:
    - Click **Install** (approx. 6-8 GB download).
    - Wait for the installation to complete.

5.  **Restart**:
    - Restart your computer OR just restart your terminal/IDE to refresh environment variables.

## Verification

After installation, verify that the tools are available:

1.  Open a new terminal.
2.  Run:
    ```bash
    cl
    ```

    - _Success_: You should see output like "Microsoft (R) C/C++ Optimizing Compiler..."
    - _Note_: You might need to run this from the "Developer Command Prompt for VS 2022" if it's not in your global path, but often npm/electron-builder can find it automatically from the registry.

## Why is this needed?

Tools like `node-gyp` (used by Electron and many native packages) rely on this compiler chain to convert C++ code into a format Node.js can execute on Windows.
