import React, { useState } from "react";
import { FileNode } from "../../utils/virtualFileSystem";

interface FileExplorerProps {
  files: FileNode[];
  onFileClick: (file: FileNode) => void;
  activeFileId?: string;
}

const FileItem: React.FC<{
  node: FileNode;
  level: number;
  onFileClick: (file: FileNode) => void;
  activeFileId?: string;
}> = ({ node, level, onFileClick, activeFileId }) => {
  const [isOpen, setIsOpen] = useState(node.isOpen || false);

  const handleClick = () => {
    if (node.type === "folder") {
      setIsOpen(!isOpen);
    } else {
      onFileClick(node);
    }
  };

  // Calculate padding based on depth level
  const itemStyle = { paddingLeft: `${level * 12 + 8}px` };

  return (
    <div>
      <div
        onClick={handleClick}
        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-[#2a2d2e] select-none text-sm transition-colors ${
          activeFileId === node.id
            ? "bg-[#37373d] text-white"
            : "text-[#cccccc]"
        }`}
        style={itemStyle}
      >
        <span className="material-symbols-outlined text-[16px] mr-1.5 opacity-80">
          {node.type === "folder"
            ? isOpen
              ? "folder_open"
              : "folder"
            : "draft"}
        </span>
        <span className="truncate">{node.name}</span>
      </div>
      {node.type === "folder" && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileItem
              key={child.id}
              node={child}
              level={level + 1}
              onFileClick={onFileClick}
              activeFileId={activeFileId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  onFileClick,
  activeFileId,
}) => {
  return (
    <div className="h-full bg-[#181818] text-white overflow-y-auto border-r border-[#2b2b2b]">
      <div className="p-3 text-xs font-bold tracking-wider text-[#bbbbbb] uppercase sticky top-0 bg-[#181818]">
        Explorer
      </div>
      {files.map((node) => (
        <FileItem
          key={node.id}
          node={node}
          level={0}
          onFileClick={onFileClick}
          activeFileId={activeFileId}
        />
      ))}
    </div>
  );
};

export default FileExplorer;
