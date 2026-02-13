import React from "react";

const SessionsSettings = () => {
    const sessions = [
        {
            id: 1,
            device: "Chrome on Windows",
            location: "New Delhi, India",
            ip: "103.xxx.xxx.xxx",
            lastActive: "Active now",
            current: true,
        },
        {
            id: 2,
            device: "Firefox on macOS",
            location: "Mumbai, India",
            ip: "103.xxx.xxx.xxx",
            lastActive: "2 hours ago",
            current: false,
        },
    ];

    return (
        <div className="space-y-8 pb-20">
            <header>
                <h1 className="text-2xl font-black text-gh-text tracking-tight mb-2">
                    Sessions
                </h1>
                <p className="text-gh-text-secondary">
                    This is a list of devices that have logged into your account. Revoke
                    any sessions that you do not recognize.
                </p>
            </header>

            <section>
                <div className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
                    {sessions.map((session, index) => (
                        <div
                            key={session.id}
                            className={`p-5 flex items-center justify-between hover:bg-white/[0.01] transition-all ${index !== sessions.length - 1 ? "border-b border-gh-border" : ""
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="size-10 rounded-lg bg-gh-bg flex items-center justify-center text-slate-500 border border-gh-border shrink-0">
                                    <span className="material-symbols-outlined !text-[20px]">
                                        devices
                                    </span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-bold text-gh-text">
                                            {session.device}
                                        </h4>
                                        {session.current && (
                                            <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full border border-green-500/20">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gh-text-secondary">
                                        {session.location} • {session.ip}
                                    </p>
                                    <p className="text-xs text-gh-text-secondary mt-1">
                                        {session.lastActive}
                                    </p>
                                </div>
                            </div>
                            {!session.current && (
                                <button className="px-4 py-1.5 bg-gh-bg border border-gh-border text-gh-text hover:bg-gh-bg-tertiary hover:border-red-500/50 hover:text-red-400 rounded-lg text-xs font-bold transition-all">
                                    Revoke
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section className="pt-6 border-t border-gh-border">
                <h3 className="text-lg font-bold text-gh-text mb-4">
                    Revoke all sessions
                </h3>
                <div className="border border-red-500/20 rounded-lg p-6 bg-red-900/5">
                    <p className="text-sm text-gh-text-secondary mb-4">
                        This will sign you out of all devices except the current one. You
                        will need to sign in again on those devices.
                    </p>
                    <button className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/50 rounded-md font-medium text-sm transition-colors">
                        Revoke all sessions
                    </button>
                </div>
            </section>
        </div>
    );
};

export default SessionsSettings;
