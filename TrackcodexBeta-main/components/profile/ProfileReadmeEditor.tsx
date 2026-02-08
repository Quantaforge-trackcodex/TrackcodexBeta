import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ProfileReadmeEditorProps {
  initialContent?: string;
  onSave: (content: string) => Promise<void>;
  onCancel: () => void;
}

const TEMPLATES = {
  aboutMe: `# Hi there 👋

I'm a passionate software engineer who loves building scalable systems.

## 🚀 About Me
- 🔭 I'm currently working on distributed systems
- 🌱 I'm learning Rust and WebAssembly
- 💬 Ask me about system design, microservices
- 📫 How to reach me: [email@example.com](mailto:email@example.com)

## 🛠️ Tech Stack
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)

## 📊 GitHub Stats
![](https://github-readme-stats.vercel.app/api?username=USERNAME&show_icons=true&theme=dark)
`,
  skills: `## 💻 Skills & Expertise

### Languages
\`\`\`
JavaScript/TypeScript  ████████████████████  95%
Python                 ██████████████████    90%
Go                     ██████████████        70%
Rust                   ████████              40%
\`\`\`

### Technologies
- **Frontend**: React, Vue.js, Next.js
- **Backend**: Node.js, Express, Fastify
- **Database**: PostgreSQL, MongoDB, Redis
- **DevOps**: Docker, Kubernetes, AWS
`,
  projects: `## 🎯 Featured Projects

### 🚀 Project Alpha
> Enterprise-grade distributed system for real-time data processing

**Tech Stack**: Go, Kafka, PostgreSQL, Kubernetes
- Handles 1M+ requests/day
- 99.99% uptime SLA
- [View on GitHub](https://github.com/username/project-alpha)

---

### 🔥 Project Beta
> Open-source developer tools platform

**Tech Stack**: TypeScript, React, Node.js
- 5k+ GitHub stars
- Active community of 200+ contributors
- [Live Demo](https://beta.example.com)
`,
};

export const ProfileReadmeEditor: React.FC<ProfileReadmeEditorProps> = ({
  initialContent = "",
  onSave,
  onCancel,
}) => {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(content);
    } finally {
      setSaving(false);
    }
  };

  const insertTemplate = (template: keyof typeof TEMPLATES) => {
    setContent((prev) => {
      if (prev) return prev + "\n\n" + TEMPLATES[template];
      return TEMPLATES[template];
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d12] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold">Profile README</h2>
          <p className="text-sm text-slate-400 mt-1">
            Showcase your skills and projects like GitHub
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save README"}
          </button>
        </div>
      </div>

      {/* Template Gallery */}
      <div className="p-4 bg-[#1a1a1f] border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Quick Templates:
          </span>
          <button
            onClick={() => insertTemplate("aboutMe")}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-xs font-medium transition-colors"
          >
            👋 About Me
          </button>
          <button
            onClick={() => insertTemplate("skills")}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-xs font-medium transition-colors"
          >
            💻 Skills
          </button>
          <button
            onClick={() => insertTemplate("projects")}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-xs font-medium transition-colors"
          >
            🎯 Projects
          </button>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setPreviewMode(false)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${!previewMode ? "bg-purple-600 text-white" : "bg-white/5 hover:bg-white/10"}`}
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => setPreviewMode(true)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${previewMode ? "bg-purple-600 text-white" : "bg-white/5 hover:bg-white/10"}`}
            >
              👁️ Preview
            </button>
          </div>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-1 overflow-hidden">
        {!previewMode ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# Hi, I'm [Your Name] 👋

Welcome to my profile! Write about yourself in Markdown...

## 🚀 About Me
...

## 💻 Skills
..."
            className="w-full h-full p-6 bg-transparent text-white font-mono text-sm resize-none focus:outline-none custom-scrollbar"
            spellCheck={false}
          />
        ) : (
          <div className="h-full overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-4xl mx-auto prose prose-invert prose-purple">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || "*No content yet. Start writing your README!*"}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Footer Help */}
      <div className="p-4 bg-[#1a1a1f] border-t border-white/5 text-xs text-slate-400">
        <div className="flex items-center gap-6">
          <span>
            <strong>Tip:</strong> Use Markdown syntax -
          </span>
          <code className="px-2 py-1 bg-white/5 rounded"># Heading</code>
          <code className="px-2 py-1 bg-white/5 rounded">**bold**</code>
          <code className="px-2 py-1 bg-white/5 rounded">*italic*</code>
          <code className="px-2 py-1 bg-white/5 rounded">[link](url)</code>
          <code className="px-2 py-1 bg-white/5 rounded">```code```</code>
        </div>
      </div>
    </div>
  );
};

export default ProfileReadmeEditor;
