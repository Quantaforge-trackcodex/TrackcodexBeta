import React, { useState } from "react";

const PrivacySettings = () => {
    const [profileVisibility, setProfileVisibility] = useState<"public" | "private">("public");
    const [settings, setSettings] = useState({
        showEmail: false,
        showLocation: true,
        showBio: true,
        showRepositories: true,
        showContributions: true,
        showActivity: true,
        showFollowers: true,
        showFollowing: true,
        showStars: true,
        showStrataHub: true,
        showProjects: true,
        showAchievements: true,
        searchableByEmail: false,
        allowIndexing: true,
    });

    const handleToggle = (key: keyof typeof settings) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <header className="border-b border-gh-border pb-6">
                <h1 className="text-2xl font-black text-gh-text tracking-tight mb-2">
                    Privacy and visibility
                </h1>
                <p className="text-sm text-gh-text-secondary leading-relaxed">
                    Control what information is visible to others and how you appear on TrackCodex.
                </p>
            </header>

            {/* Profile Visibility Alert */}
            {profileVisibility === "private" && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-blue-400 text-2xl">info</span>
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-2">
                                Only you can see your full profile
                            </h3>
                            <p className="text-sm text-gh-text-secondary mb-3">
                                You have marked your profile as private, which limits what activity other people
                                can see.{" "}
                                <a href="#" className="text-primary hover:underline">
                                    Update profile settings
                                </a>
                                .
                            </p>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 bg-gh-bg border border-gh-border text-gh-text rounded-lg text-sm font-bold hover:bg-gh-bg-tertiary transition-all">
                                    View what others see
                                </button>
                                <a href="#" className="text-primary hover:underline text-sm font-bold py-2">
                                    Send feedback
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Visibility */}
            <section className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gh-border">
                    <h2 className="text-lg font-bold text-gh-text mb-1">Profile visibility</h2>
                    <p className="text-sm text-gh-text-secondary">
                        Choose who can see your profile and activity on TrackCodex.
                    </p>
                </div>

                <div className="p-6 space-y-4">
                    <label className="flex items-start gap-4 cursor-pointer group">
                        <input
                            type="radio"
                            name="visibility"
                            checked={profileVisibility === "public"}
                            onChange={() => setProfileVisibility("public")}
                            className="mt-1 w-4 h-4 text-primary"
                        />
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-1">Public profile</h3>
                            <p className="text-sm text-gh-text-secondary">
                                Anyone on the internet can see your profile, repositories, and activity.
                            </p>
                        </div>
                    </label>

                    <label className="flex items-start gap-4 cursor-pointer group">
                        <input
                            type="radio"
                            name="visibility"
                            checked={profileVisibility === "private"}
                            onChange={() => setProfileVisibility("private")}
                            className="mt-1 w-4 h-4 text-primary"
                        />
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-1">Private profile</h3>
                            <p className="text-sm text-gh-text-secondary">
                                Only you can see your full profile. Others will see limited information.
                            </p>
                        </div>
                    </label>
                </div>
            </section>

            {/* Profile Information */}
            <section className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gh-border">
                    <h2 className="text-lg font-bold text-gh-text mb-1">Profile information</h2>
                    <p className="text-sm text-gh-text-secondary">
                        Control what personal information is visible on your public profile.
                    </p>
                </div>

                <div className="divide-y divide-gh-border">
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-1">Email address</h3>
                            <p className="text-sm text-gh-text-secondary">
                                Show your email address on your public profile
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggle("showEmail")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showEmail ? "bg-primary" : "bg-gh-border"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showEmail ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="p-6 flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-1">Location</h3>
                            <p className="text-sm text-gh-text-secondary">
                                Show your location on your public profile
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggle("showLocation")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showLocation ? "bg-primary" : "bg-gh-border"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showLocation ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="p-6 flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-1">Bio</h3>
                            <p className="text-sm text-gh-text-secondary">Show your bio on your public profile</p>
                        </div>
                        <button
                            onClick={() => handleToggle("showBio")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showBio ? "bg-primary" : "bg-gh-border"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showBio ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </section>

            {/* Activity and Contributions */}
            <section className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gh-border">
                    <h2 className="text-lg font-bold text-gh-text mb-1">Activity and contributions</h2>
                    <p className="text-sm text-gh-text-secondary">
                        Control what activity and contribution data is visible to others.
                    </p>
                </div>

                <div className="divide-y divide-gh-border">
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-1">Repositories</h3>
                            <p className="text-sm text-gh-text-secondary">
                                Show your public repositories on your profile
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggle("showRepositories")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showRepositories ? "bg-primary" : "bg-gh-border"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showRepositories ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="p-6 flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-1">Contribution graph</h3>
                            <p className="text-sm text-gh-text-secondary">
                                Show your contribution activity graph on your profile
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggle("showContributions")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showContributions ? "bg-primary" : "bg-gh-border"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showContributions ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="p-6 flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-1">Activity feed</h3>
                            <p className="text-sm text-gh-text-secondary">
                                Show your recent activity on your profile
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggle("showActivity")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showActivity ? "bg-primary" : "bg-gh-border"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showActivity ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="p-6 flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-1">Stars</h3>
                            <p className="text-sm text-gh-text-secondary">
                                Show repositories you've starred on your profile
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggle("showStars")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showStars ? "bg-primary" : "bg-gh-border"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showStars ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="p-6 flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-1">Projects</h3>
                            <p className="text-sm text-gh-text-secondary">Show your projects on your profile</p>
                        </div>
                        <button
                            onClick={() => handleToggle("showProjects")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showProjects ? "bg-primary" : "bg-gh-border"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showProjects ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="p-6 flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-1">Achievements</h3>
                            <p className="text-sm text-gh-text-secondary">
                                Show your achievements and badges on your profile
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggle("showAchievements")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showAchievements ? "bg-primary" : "bg-gh-border"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showAchievements ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </section>

            {/* Social */}
            <section className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gh-border">
                    <h2 className="text-lg font-bold text-gh-text mb-1">Social</h2>
                    <p className="text-sm text-gh-text-secondary">
                        Control what social information is visible on your profile.
                    </p>
                </div>

                <div className="divide-y divide-gh-border">
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-1">Followers</h3>
                            <p className="text-sm text-gh-text-secondary">
                                Show your followers list on your profile
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggle("showFollowers")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showFollowers ? "bg-primary" : "bg-gh-border"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showFollowers ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="p-6 flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-1">Following</h3>
                            <p className="text-sm text-gh-text-secondary">
                                Show who you're following on your profile
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggle("showFollowing")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showFollowing ? "bg-primary" : "bg-gh-border"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showFollowing ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="p-6 flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-1">StrataHub</h3>
                            <p className="text-sm text-gh-text-secondary">
                                Show StrataHub teams you're a member of on your profile
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggle("showStrataHub")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showStrataHub ? "bg-primary" : "bg-gh-border"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showStrataHub ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </section>

            {/* Discoverability */}
            <section className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gh-border">
                    <h2 className="text-lg font-bold text-gh-text mb-1">Discoverability</h2>
                    <p className="text-sm text-gh-text-secondary">
                        Control how others can find you on TrackCodex.
                    </p>
                </div>

                <div className="divide-y divide-gh-border">
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-1">Searchable by email</h3>
                            <p className="text-sm text-gh-text-secondary">
                                Allow others to find you by your email address
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggle("searchableByEmail")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.searchableByEmail ? "bg-primary" : "bg-gh-border"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.searchableByEmail ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="p-6 flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-base font-bold text-gh-text mb-1">Search engine indexing</h3>
                            <p className="text-sm text-gh-text-secondary">
                                Allow search engines to index your public profile
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggle("allowIndexing")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.allowIndexing ? "bg-primary" : "bg-gh-border"
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.allowIndexing ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacySettings;
