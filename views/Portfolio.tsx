import React, { useState, useEffect } from "react";
import { profileService, UserProfile } from "../services/profile";
import SkillRadarChart from "../components/radar/SkillRadarChart";
import SkillBreakdown from "../components/radar/SkillBreakdown";


const Portfolio = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [activeTab, setActiveTab] = useState<"featured" | "all">("featured");
    const [skills] = useState([
        { name: "Notion", icon: "description", category: "software" },
        { name: "Figma", icon: "design_services", category: "software" },
        { name: "Webflow", icon: "web", category: "software" },
        { name: "Google Sheets", icon: "table_chart", category: "software" },
        { name: "Final Cut Pro", icon: "movie", category: "software" },
        { name: "Python", icon: "code", category: "language" },
    ]);

    const [projects] = useState([
        {
            id: 1,
            title: "Discord's Coaching",
            description: "A Notion session for team management in Notion.",
            category: "Coaching",
            image: "/api/placeholder/400/300",
            featured: true,
        },
        {
            id: 2,
            title: "Ali Abdaal's Workspace",
            description: "A Notion workspace for business and content management.",
            category: "Notion Workspace",
            image: "/api/placeholder/400/300",
            featured: true,
        },
    ]);

    useEffect(() => {
        const currentProfile = profileService.getProfile();
        setProfile(currentProfile);
    }, []);

    return (
        <div className="min-h-screen bg-[#0d1117] text-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="mb-12">
                    <h1 className="text-5xl font-bold mb-6">Portfolio</h1>

                    <div className="flex items-start gap-8">
                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold mb-4">
                                Hello, I'm {profile?.name || "User"}.
                            </h2>
                            <p className="text-[#8b949e] mb-4 leading-relaxed">
                                {profile?.bio || "Welcome to my portfolio. Here you can find my skills and projects."}
                            </p>
                            <p className="text-[#8b949e] leading-relaxed">
                                {profile?.location && `Based in ${profile.location}. `}
                                {profile?.company && `Working at ${profile.company}.`}
                            </p>
                        </div>

                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <img
                                src={profile?.avatar || "https://github.com/identicons/default.png"}
                                alt={profile?.name || "User"}
                                className="w-32 h-32 rounded-lg border-2 border-gh-border object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6">Skills</h2>

                    {/* Category Tabs */}
                    <div className="flex gap-4 mb-6">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#21262d] rounded-md text-sm text-[#8b949e] hover:bg-[#30363d] transition-colors">
                            <span className="material-symbols-outlined !text-[16px]">computer</span>
                            Software
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#21262d] rounded-md text-sm text-[#8b949e] hover:bg-[#30363d] transition-colors">
                            <span className="material-symbols-outlined !text-[16px]">star</span>
                            Expertise
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#21262d] rounded-md text-sm text-[#8b949e] hover:bg-[#30363d] transition-colors">
                            <span className="material-symbols-outlined !text-[16px]">translate</span>
                            Language
                        </button>
                    </div>

                    {/* Skills Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        {skills.map((skill, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 px-4 py-3 bg-[#161b22] border border-[#30363d] rounded-md hover:border-[#58a6ff] transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined !text-[20px] text-[#8b949e]">
                                    {skill.icon}
                                </span>
                                <span className="text-sm">{skill.name}</span>
                            </div>
                        ))}
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-[#8b949e] hover:text-white transition-colors">
                        <span className="material-symbols-outlined !text-[16px]">add</span>
                        New
                    </button>
                </div>

                {/* Skill Radar Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                        Skill Radar
                        <span className="text-xs font-normal text-[#8b949e] border border-[#30363d] px-2 py-0.5 rounded-full">Beta</span>
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <SkillRadarChart
                                data={{
                                    coding: 75,
                                    quality: 82,
                                    bugDetection: 45,
                                    security: 60,
                                    collaboration: 90,
                                    architecture: 30,
                                    consistency: 95,
                                    communityImpact: 55
                                }}
                                platformAverage={{
                                    coding: 50,
                                    quality: 50,
                                    bugDetection: 20,
                                    security: 10,
                                    collaboration: 60,
                                    architecture: 30,
                                    consistency: 40,
                                    communityImpact: 20
                                }}
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 h-full">
                                <h3 className="font-bold text-lg mb-4">Performance Breakdown</h3>
                                <p className="text-[#8b949e] text-sm mb-6">
                                    Your <strong>Consistency</strong> and <strong>Collaboration</strong> scores are in the top 5% of the platform.
                                    Focus on <strong>Architecture</strong> to unlock multi-workspace creation privileges.
                                </p>
                                <SkillBreakdown
                                    data={{
                                        coding: 75,
                                        quality: 82,
                                        bugDetection: 45,
                                        security: 60,
                                        collaboration: 90,
                                        architecture: 30,
                                        consistency: 95,
                                        communityImpact: 55
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Projects Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-6">Projects</h2>

                    {/* Project Tabs */}
                    <div className="flex gap-6 mb-6 border-b border-[#30363d]">
                        <button
                            onClick={() => setActiveTab("featured")}
                            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === "featured"
                                ? "text-white"
                                : "text-[#8b949e] hover:text-white"
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined !text-[16px]">star</span>
                                Featured
                            </span>
                            {activeTab === "featured" && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f78166]"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === "all"
                                ? "text-white"
                                : "text-[#8b949e] hover:text-white"
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined !text-[16px]">grid_view</span>
                                All Projects
                            </span>
                            {activeTab === "all" && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f78166]"></div>
                            )}
                        </button>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-4">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden hover:border-[#58a6ff] transition-colors cursor-pointer group"
                            >
                                {/* Project Image */}
                                <div className="aspect-video bg-[#21262d] flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="w-24 h-24 text-[#30363d]" fill="currentColor" viewBox="0 0 100 100">
                                            <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="48" fontWeight="bold">
                                                N
                                            </text>
                                        </svg>
                                    </div>
                                    <span className="text-6xl font-bold text-[#30363d] relative z-10">Notion</span>
                                </div>

                                {/* Project Info */}
                                <div className="p-4">
                                    <div className="flex items-start gap-2 mb-2">
                                        <span className="material-symbols-outlined !text-[16px] text-[#8b949e] mt-0.5">
                                            folder
                                        </span>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-white group-hover:text-[#58a6ff] transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm text-[#8b949e] mt-1">{project.description}</p>
                                            <p className="text-xs text-[#8b949e] mt-2">{project.category}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-[#8b949e] hover:text-white transition-colors">
                        <span className="material-symbols-outlined !text-[16px]">add</span>
                        New
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
