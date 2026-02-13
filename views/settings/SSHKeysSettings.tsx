import React, { useState } from "react";

const SSHKeysSettings = () => {
    const [keys] = useState([
        {
            id: 1,
            title: "Personal MacBook Pro",
            fingerprint: "SHA256:nThbg6kXUpJWGl7E1IGOCspRomTxdCARLviKw6E5SY8",
            added: "Added on Jan 15, 2024",
        },
    ]);

    return (
        <div className="space-y-8 pb-20">
            <header>
                <h1 className="text-2xl font-black text-gh-text tracking-tight mb-2">
                    SSH and GPG keys
                </h1>
                <p className="text-gh-text-secondary">
                    Manage your SSH keys for Git operations and GPG keys for signing
                    commits.
                </p>
            </header>

            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gh-text">SSH keys</h3>
                    <button className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg text-sm font-bold transition-all">
                        New SSH key
                    </button>
                </div>

                {keys.length > 0 ? (
                    <div className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
                        {keys.map((key, index) => (
                            <div
                                key={key.id}
                                className={`p-5 flex items-center justify-between hover:bg-white/[0.01] transition-all ${index !== keys.length - 1 ? "border-b border-gh-border" : ""
                                    }`}
                            >
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    <div className="size-10 rounded-lg bg-gh-bg flex items-center justify-center text-slate-500 border border-gh-border shrink-0">
                                        <span className="material-symbols-outlined !text-[20px]">
                                            key
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-sm font-bold text-gh-text mb-1">
                                            {key.title}
                                        </h4>
                                        <p className="text-xs text-gh-text-secondary font-mono truncate">
                                            {key.fingerprint}
                                        </p>
                                        <p className="text-xs text-gh-text-secondary mt-1">
                                            {key.added}
                                        </p>
                                    </div>
                                </div>
                                <button className="px-4 py-1.5 bg-gh-bg border border-gh-border text-gh-text hover:bg-gh-bg-tertiary hover:border-red-500/50 hover:text-red-400 rounded-lg text-xs font-bold transition-all ml-4">
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-12 px-6 text-center border border-dashed border-gh-border rounded-2xl bg-gh-bg/30">
                        <div className="size-16 rounded-full bg-gh-bg-secondary border border-gh-border flex items-center justify-center text-slate-600 mb-6">
                            <span className="material-symbols-outlined !text-[32px]">
                                key
                            </span>
                        </div>
                        <h4 className="text-xl font-bold text-gh-text mb-3">
                            No SSH keys
                        </h4>
                        <p className="text-sm text-gh-text-secondary max-w-lg mb-8 leading-relaxed">
                            SSH keys allow you to establish a secure connection to TrackCodex
                            for Git operations.
                        </p>
                    </div>
                )}
            </section>

            <section className="pt-6 border-t border-gh-border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gh-text">GPG keys</h3>
                    <button className="px-4 py-2 bg-gh-bg-secondary border border-gh-border text-gh-text hover:bg-gh-bg-tertiary rounded-lg text-sm font-bold transition-all">
                        New GPG key
                    </button>
                </div>

                <div className="flex flex-col items-center py-12 px-6 text-center border border-dashed border-gh-border rounded-2xl bg-gh-bg/30">
                    <div className="size-16 rounded-full bg-gh-bg-secondary border border-gh-border flex items-center justify-center text-slate-600 mb-6">
                        <span className="material-symbols-outlined !text-[32px]">
                            verified_user
                        </span>
                    </div>
                    <h4 className="text-xl font-bold text-gh-text mb-3">
                        No GPG keys
                    </h4>
                    <p className="text-sm text-gh-text-secondary max-w-lg leading-relaxed">
                        GPG keys are used to sign commits and tags, proving that they came
                        from a trusted source.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default SSHKeysSettings;
