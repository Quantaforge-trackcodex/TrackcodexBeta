<div align="center">

  <h1>TrackCodex</h1>
  <h3>The Next-Generation AI-Powered Developer Workspace</h3>
  <p><b>Developed by Quantaforze LLC</b></p>
</div>

<br />

![License](https://img.shields.io/badge/license-Proprietary-blue.svg)
![Version](https://img.shields.io/badge/version-0.1.10-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)

## 🚀 Overview

**TrackCodex** is an advanced developer productivity platform designed to bridge the gap between project management, code collaboration, and AI-assisted development. Built as a native desktop application, it integrates deeply with your local environment while connecting you to the cloud.

Powered by **ForgeAI**, TrackCodex offers context-aware coding assistance, automated refactoring, and intelligent project insights.

## ✨ Key Features

- **🤖 ForgeAI Assistant**: Integrated AI that understands your entire repository context, not just single files.
- **📂 Desktop Workspace**: Native file system integration for seamless local development.
- **🔐 Secure Authentication**: Enterprise-grade login via Google and GitHub (OAuth 2.0).
- **👥 Team Collaboration**: Manage organizations, teams, and permissions with ease.
- **📊 Integrated Dashboard**: Track issues, pull requests, and project health in one view.
- **🎨 Amazing UI/UX**: A modern, dark-themed interface built for focus and aesthetics.

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TailwindCSS
- **Backend**: Node.js, Fastify, Prisma (PostgreSQL)
- **Desktop**: Electron
- **Language**: TypeScript

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL Database
- Git

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/Quantaforze-trackcodex/meeting_1.git
    cd meeting_1
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/trackcodex"
    GOOGLE_CLIENT_ID="..."
    GOOGLE_CLIENT_SECRET="..."
    GITHUB_CLIENT_ID="..."
    GITHUB_CLIENT_SECRET="..."
    ```

4.  **Run Development Server**
    ```bash
    npm run start:all
    ```

### 📦 Building for Production

To create a native installer for your OS:

```bash
# Windows
npm run dist:win

# macOS
npm run dist:mac

# Linux
npm run dist:linux
```

The installer will be generated in the `release/` directory.

## 🤝 Contributing

This is a proprietary product of **Quantaforze LLC**. External contributions are currently closed.

## 📄 License

Copyright &copy; 2026-present **Quantaforze LLC**. All rights reserved.
