# Git Repository Cloning Feature

This document explains how the Git repository cloning feature works in TrackCodex workspaces.

## Overview

Users can now create workspaces by importing existing Git repositories from GitHub, GitLab, Bitbucket, or any other Git provider. The system automatically clones the repository and sets up the workspace.

## Features

### 1. **Repository Import**

- Paste any Git repository URL (HTTPS or SSH)
- Automatic provider detection (GitHub, GitLab, Bitbucket)
- URL validation before cloning
- Real-time cloning status updates

### 2. **Supported Providers**

- **GitHub**: `https://github.com/username/repo.git`
- **GitLab**: `https://gitlab.com/username/repo.git`
- **Bitbucket**: `https://bitbucket.org/username/repo.git`
- **Other**: Any valid Git repository URL

### 3. **Workspace Lifecycle**

- **Cloning**: Repository is being cloned
- **Ready**: Repository cloned successfully, workspace ready to use
- **Failed**: Cloning failed (invalid URL, network issues, etc.)

## How It Works

### Frontend Flow

1. User selects "Import Git" option in workspace creation
2. User pastes repository URL
3. System auto-detects Git provider
4. User clicks "Create Workspace"
5. Workspace is created with status "Cloning"
6. User is redirected to workspace page
7. Status updates to "Ready" when cloning completes

### Backend Flow

1. **Validation**: URL is validated using regex patterns
2. **Database**: Workspace record created with `repoUrl` and status "Cloning"
3. **Cloning**: `simple-git` library clones repository to `workspaces/{workspaceId}/`
4. **Status Update**: Workspace status updated to "Ready" or "Failed"
5. **Cleanup**: On workspace deletion, cloned repository is removed

## API Endpoints

### Create Workspace with Repository

```http
POST /api/v1/workspaces
Content-Type: application/json

{
  "name": "My Project",
  "description": "Imported from GitHub",
  "setupMode": "import",
  "repositoryUrl": "https://github.com/username/repo.git",
  "gitProvider": "github"
}
```

**Response:**

```json
{
  "id": "workspace-uuid",
  "name": "My Project",
  "status": "Cloning",
  "repoUrl": "https://github.com/username/repo.git",
  "createdAt": "2026-01-31T...",
  ...
}
```

### Check Workspace Status

```http
GET /api/v1/workspaces/:id
```

**Response:**

```json
{
  "id": "workspace-uuid",
  "status": "Ready",  // or "Cloning", "Failed"
  "repoUrl": "https://github.com/username/repo.git",
  ...
}
```

### Delete Workspace

```http
DELETE /api/v1/workspaces/:id
```

Automatically deletes both the database record and the cloned repository.

## File Structure

```
meeting_1/
├── backend/
│   ├── services/
│   │   └── gitService.ts       # Git operations service
│   └── routes/
│       └── workspaces.ts       # Workspace API with Git integration
├── views/
│   └── CreateWorkspace.tsx     # UI for workspace creation
└── workspaces/                 # Cloned repositories (gitignored)
    ├── workspace-uuid-1/
    ├── workspace-uuid-2/
    └── ...
```

## Git Service API

### `gitService.cloneRepository(repoUrl, workspaceId)`

Clones a repository to the workspace directory.

### `gitService.isValidGitUrl(url)`

Validates if a URL is a valid Git repository URL.

### `gitService.getRepositoryInfo(repoUrl)`

Extracts provider, owner, and repository name from URL.

### `gitService.deleteWorkspace(workspaceId)`

Deletes the cloned repository directory.

### `gitService.pullLatestChanges(workspaceId)`

Pulls latest changes from remote (for future use).

### `gitService.getCurrentBranch(workspaceId)`

Gets the current branch of a workspace (for future use).

## Error Handling

### Common Errors

1. **Invalid URL**
   - Status Code: 400
   - Message: "Invalid Git repository URL..."

2. **Cloning Failed**
   - Workspace status: "Failed"
   - Logged in server logs
   - Possible causes: Network issues, private repo without auth, invalid URL

3. **Directory Already Exists**
   - Prevents duplicate cloning
   - Workspace ID ensures uniqueness

## Security Considerations

1. **Public Repositories Only** (Current Implementation)
   - Only public repositories can be cloned
   - Private repositories require authentication (future enhancement)

2. **URL Validation**
   - All URLs are validated before cloning
   - Prevents malicious URLs

3. **Workspace Isolation**
   - Each workspace has its own directory
   - No cross-workspace file access

## Future Enhancements

- [ ] SSH key support for private repositories
- [ ] OAuth integration for GitHub/GitLab
- [ ] Branch selection during import
- [ ] Automatic pull on workspace start
- [ ] Git operations UI (commit, push, pull)
- [ ] Webhook support for auto-sync
- [ ] Submodule support
- [ ] Large repository optimization

## Dependencies

```json
{
  "simple-git": "^3.x.x"
}
```

## Setup

1. Install dependencies:

   ```bash
   npm install simple-git
   ```

2. Ensure Git is installed on the server:

   ```bash
   git --version
   ```

3. The `workspaces/` directory will be created automatically

4. Start the server:
   ```bash
   npm run server
   ```

## Testing

### Test Repository Import

1. Navigate to workspace creation page
2. Select "Import Git"
3. Paste a public repository URL:
   - Example: `https://github.com/microsoft/vscode.git`
4. Click "Create Workspace"
5. Check server logs for cloning progress
6. Verify workspace status updates to "Ready"
7. Check `workspaces/{id}/` directory for cloned files

### Test Deletion

1. Delete a workspace from the UI
2. Verify the `workspaces/{id}/` directory is removed
3. Check database for workspace removal

## Troubleshooting

### Issue: Cloning takes too long

**Solution**: Use `--depth 1` flag (already implemented) for shallow clones

### Issue: Permission denied

**Solution**: Ensure server has write permissions to `workspaces/` directory

### Issue: Git not found

**Solution**: Install Git on the server: `apt-get install git` (Linux) or download from git-scm.com (Windows)

### Issue: TypeScript errors about `repoUrl`

**Solution**: Regenerate Prisma client: `npx prisma generate`

## Monitoring

Server logs include:

- Cloning start: `Cloning {url} to {path}...`
- Cloning success: `Successfully cloned {url}`
- Cloning failure: `Failed to clone repository: {error}`
- Deletion: `Deleted workspace: {id}`
