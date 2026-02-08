import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { enterpriseApi, Enterprise } from '../../services/enterprise';

export default function EnterpriseSettings() {
    const { slug } = useParams<{ slug: string }>();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        displayName: '',
        description: '',
        websiteUrl: '',
        location: '',
        securityEmail: ''
    });

    useEffect(() => {
        const loadEnterprise = async () => {
            try {
                setLoading(true);
                const data = await enterpriseApi.get(slug!);
                setFormData({
                    displayName: data.name,
                    description: '', // Mock data
                    websiteUrl: '',
                    location: '',
                    securityEmail: ''
                });
            } catch (error) {
                console.error("Failed to load enterprise", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            loadEnterprise();
        }
    }, [slug]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) return <div className="p-8 text-gh-text-secondary">Loading settings...</div>;

    return (
        <div className="flex h-full min-h-screen bg-gh-bg text-gh-text">
            {/* Sidebar */}
            <div className="w-64 pr-8 hidden md:block border-r border-gh-border mr-8">
                <div className="mb-4">
                    <h3 className="px-2 text-xs font-semibold text-gh-text mb-2">Settings</h3>
                    <nav className="space-y-1">
                        <a href="#" className="flex items-center gap-2 px-2 py-1.5 bg-gh-bg-tertiary text-gh-text rounded-md text-sm font-semibold border-l-2 border-orange-500">
                            Profile
                        </a>
                        <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-gh-text-secondary hover:bg-gh-bg-tertiary hover:text-gh-text rounded-md text-sm transition-colors">
                            Authentication security
                        </a>
                        <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-[#8b949e] hover:bg-[rgba(110,118,129,0.1)] hover:text-[#c9d1d9] rounded-md text-sm transition-colors">
                            Advanced Security
                        </a>
                        <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-[#8b949e] hover:bg-[rgba(110,118,129,0.1)] hover:text-[#c9d1d9] rounded-md text-sm transition-colors">
                            Verified & approved domains
                        </a>
                        <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-[#8b949e] hover:bg-[rgba(110,118,129,0.1)] hover:text-[#c9d1d9] rounded-md text-sm transition-colors">
                            Audit log
                        </a>
                        <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-[#8b949e] hover:bg-[rgba(110,118,129,0.1)] hover:text-[#c9d1d9] rounded-md text-sm transition-colors">
                            Hooks
                        </a>
                        <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-[#8b949e] hover:bg-[rgba(110,118,129,0.1)] hover:text-[#c9d1d9] rounded-md text-sm transition-colors">
                            Hosted compute networking
                        </a>
                        <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-[#8b949e] hover:bg-[rgba(110,118,129,0.1)] hover:text-[#c9d1d9] rounded-md text-sm transition-colors">
                            GitHub Apps
                        </a>
                        <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-[#8b949e] hover:bg-[rgba(110,118,129,0.1)] hover:text-[#c9d1d9] rounded-md text-sm transition-colors">
                            Announcement
                        </a>
                        <a href="#" className="flex items-center gap-2 px-2 py-1.5 text-[#8b949e] hover:bg-[rgba(110,118,129,0.1)] hover:text-[#c9d1d9] rounded-md text-sm transition-colors">
                            Support
                        </a>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-4xl">
                <h2 className="text-2xl font-semibold text-gh-text mb-6 border-b border-gh-border pb-2">Manage your enterprise profile</h2>

                <div className="flex gap-4 border-b border-gh-border mb-6">
                    <button className="px-4 py-2 text-sm font-medium text-gh-text border-b-2 border-orange-500 -mb-px">
                        Enterprise profile
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gh-text-secondary hover:text-gh-text border-b-2 border-transparent hover:border-gh-text-secondary -mb-px transition-colors">
                        Custom footer
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gh-text">
                        Your enterprise profile URL is <a href="#" className="text-blue-400 hover:underline">https://github.com/enterprises/{slug}</a>.
                    </p>
                </div>

                <div className="flex gap-8 mb-8">
                    {/* Form */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <label htmlFor="display-name" className="block text-sm font-semibold text-gh-text mb-1">
                                Enterprise display name <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="display-name"
                                type="text"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleChange}
                                className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-1.5 text-sm text-gh-text focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                            <p className="text-xs text-gh-text-secondary mt-1">Required name used to refer to your enterprise around GitHub.</p>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-[#c9d1d9] mb-1">
                                Description
                            </label>
                            <input
                                id="description"
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-1.5 text-sm text-gh-text focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                            <p className="text-xs text-gh-text-secondary mt-1">
                                Optional description of your enterprise to be shown on your <a href="#" className="text-blue-400 hover:underline">enterprise profile page</a>.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="website-url" className="block text-sm font-semibold text-[#c9d1d9] mb-1">
                                Website URL
                            </label>
                            <input
                                id="website-url"
                                type="text"
                                name="websiteUrl"
                                value={formData.websiteUrl}
                                onChange={handleChange}
                                className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-1.5 text-sm text-gh-text focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                            <p className="text-xs text-gh-text-secondary mt-1">
                                Optional URL of your enterprise website to be shown on your <a href="#" className="text-blue-400 hover:underline">enterprise profile page</a>.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-semibold text-[#c9d1d9] mb-1">
                                Location
                            </label>
                            <input
                                id="location"
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-1.5 text-sm text-gh-text focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                            <p className="text-xs text-gh-text-secondary mt-1">
                                Optional location of your enterprise to be shown on your <a href="#" className="text-blue-400 hover:underline">enterprise profile page</a>.
                            </p>
                        </div>

                        <div>
                            <label htmlFor="security-email" className="block text-sm font-semibold text-[#c9d1d9] mb-1">
                                Security contact email
                            </label>
                            <input
                                id="security-email"
                                type="email"
                                name="securityEmail"
                                value={formData.securityEmail}
                                onChange={handleChange}
                                className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-1.5 text-sm text-gh-text focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                            <p className="text-xs text-gh-text-secondary mt-1">
                                Optional additional email address for security incident notifications. Notifications will also be sent to relevant technical stakeholders as determined by GitHub.
                            </p>
                        </div>

                        <button className="mt-4 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium text-sm transition-colors border border-gh-border">
                            Update profile
                        </button>
                    </div>

                    {/* Profile Picture */}
                    <div className="w-48">
                        <label className="block text-sm font-semibold text-gh-text mb-2">
                            Profile picture
                        </label>
                        <div className="border border-gh-border rounded-md p-1 mb-2 bg-gh-bg">
                            <div className="aspect-square bg-[#f0f6fc] rounded flex items-center justify-center">
                                <span className="material-symbols-outlined text-6xl text-[#d0d7de] select-none">
                                    {/* Placeholder identicon-like */}
                                    token
                                </span>
                            </div>
                        </div>
                        <button className="w-full px-3 py-1.5 bg-gh-bg-secondary hover:bg-gh-bg-tertiary text-gh-text border border-gh-border rounded-md font-medium text-xs transition-colors">
                            Upload new picture
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gh-text mb-2">Danger zone</h3>
                    <div className="border border-gh-border rounded-md overflow-hidden">
                        <div className="p-4 border-b border-gh-border flex justify-between items-center bg-gh-bg">
                            <div>
                                <h4 className="text-sm font-semibold text-gh-text">Change enterprise URL slug</h4>
                                <p className="text-xs text-gh-text-secondary">Changing the enterprise URL slug can have unintended side effects.</p>
                            </div>
                            <button className="px-3 py-1.5 text-gh-text bg-gh-bg-secondary hover:bg-red-600 border border-gh-border hover:border-red-600 hover:text-white rounded-md text-xs font-semibold transition-colors">
                                Change enterprise URL slug
                            </button>
                        </div>

                        <div className="p-4 flex justify-between items-center bg-gh-bg">
                            <div>
                                <h4 className="text-sm font-semibold text-gh-text">Cancel trial</h4>
                                <p className="text-xs text-gh-text-secondary">Once you cancel this trial there is no going back. Please be certain.</p>
                            </div>
                            <button className="px-3 py-1.5 text-gh-text bg-gh-bg-secondary hover:bg-red-600 border border-gh-border hover:border-red-600 hover:text-white rounded-md text-xs font-semibold transition-colors">
                                Cancel trial
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
