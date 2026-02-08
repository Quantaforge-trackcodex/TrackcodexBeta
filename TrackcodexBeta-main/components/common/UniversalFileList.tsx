import React from "react";

export interface FileItem {
  name: string;
  type: "dir" | "file";
  commitVal: string;
  time: string;
  icon?: string;
  path: string;
}

export interface UniversalFileListProps {
  files: FileItem[];
  onFileClick?: (file: FileItem) => void;
  currentPath?: string;
  latestCommit?: {
    message: string;
    author: string;
    time: string;
    avatar?: string;
    count?: string;
  };
}

const UniversalFileList: React.FC<UniversalFileListProps> = ({
  files,
  onFileClick,
  latestCommit,
}) => {
  return (
    <div className="border border-gh-border rounded-md overflow-hidden bg-gh-bg">
      {/* Table Header / Latest Commit Info */}
      {latestCommit && (
        <div className="bg-gh-bg-secondary p-3 text-sm text-gh-text-secondary flex items-center gap-3 border-b border-gh-border">
          <div className="flex items-center gap-2">
            {latestCommit.avatar && (
              <img
                src={latestCommit.avatar}
                alt="Avatar"
                className="w-5 h-5 rounded-full"
              />
            )}
            <span className="text-gh-text font-bold">
              {latestCommit.author}
            </span>
          </div>
          <span className="truncate flex-1 hover:text-primary cursor-pointer hover:underline">
            {latestCommit.message}
          </span>
          <span className="text-gh-text-secondary whitespace-nowrap">
            {latestCommit.time}
          </span>
          {latestCommit.count && (
            <div className="text-gh-text-secondary font-mono text-xs flex items-center gap-1">
              <span className="material-symbols-outlined !text-[14px]">
                history
              </span>
              <span>{latestCommit.count}</span>
            </div>
          )}
        </div>
      )}

      {/* File List */}
      <div className="divide-y divide-gh-border">
        {files.map((file, idx) => (
          <div
            key={idx}
            onClick={() => onFileClick && onFileClick(file)}
            className="flex items-center px-4 py-2 hover:bg-gh-bg-secondary group transition-colors cursor-pointer"
          >
            <div className="w-[240px] flex items-center gap-3 min-w-[200px]">
              <span
                className={`material-symbols-outlined !text-[18px] ${
                  file.type === "dir"
                    ? "text-primary"
                    : "text-gh-text-secondary"
                }`}
              >
                {file.icon || (file.type === "dir" ? "folder" : "description")}
              </span>
              <span className="text-gh-text text-sm hover:text-primary hover:underline truncate">
                {file.name}
              </span>
            </div>
            <div className="flex-1 truncate px-4">
              <span className="text-gh-text-secondary text-sm truncate hover:text-primary hover:underline cursor-pointer">
                {file.commitVal}
              </span>
            </div>
            <div className="w-[100px] text-right text-gh-text-secondary text-sm whitespace-nowrap">
              {file.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UniversalFileList;
