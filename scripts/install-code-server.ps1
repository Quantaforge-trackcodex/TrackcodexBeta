$ErrorActionPreference = "Stop"

# Configuration
$Version = "4.96.4"
$BaseUrl = "https://github.com/coder/code-server/releases/download/v$Version"
$ZipName = "code-server-$Version-windows-amd64.zip"
$Url = "$BaseUrl/$ZipName"

# Paths
$RootDir = Get-Location
$EngineDir = Join-Path $RootDir ".vscode_engine"
$ZipPath = Join-Path $EngineDir "code-server.zip"
$ExtractName = "code-server-$Version-windows-amd64"
$ExtractPath = Join-Path $EngineDir $ExtractName
$FinalPath = Join-Path $EngineDir "code-server-bin"

Write-Host "Create directory: $EngineDir"
if (-not (Test-Path $EngineDir)) {
    New-Item -ItemType Directory -Force -Path $EngineDir | Out-Null
}

Write-Host "Downloading $Url..."
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
try {
    Invoke-WebRequest -Uri $Url -OutFile $ZipPath -UseBasicParsing
}
catch {
    Write-Error "Download failed: $_"
    exit 1
}

Write-Host "Extracting..."
Expand-Archive -Path $ZipPath -DestinationPath $EngineDir -Force

Write-Host "Setting up binary..."
if (Test-Path $FinalPath) {
    Remove-Item -Path $FinalPath -Recurse -Force
}

if (Test-Path $ExtractPath) {
    Rename-Item -Path $ExtractPath -NewName "code-server-bin"
} else {
    Write-Error "Extraction failed: Folder $ExtractPath not found"
    exit 1
}

# Cleanup
if (Test-Path $ZipPath) {
    Remove-Item -Path $ZipPath
}

Write-Host "SUCCESS: Installed to $FinalPath"
