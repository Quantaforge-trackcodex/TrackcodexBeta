import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { enterpriseApi } from "../../services/enterprise";
import Footer from "../../components/layout/Footer";

// Step 1: Enterprise Type Selection
const EnterpriseTypeSelection = ({ onSelect }: { onSelect: (type: string) => void }) => {
    return (
        <div className="max-w-2xl mx-auto pt-20 px-8">
            <h2 className="text-2xl font-bold text-gh-text mb-4">Start by choosing an enterprise type</h2>
            <p className="text-gh-text-secondary mb-8 text-sm">
                Your enterprise type determines whether members can contribute to public repositories and if they can use their personal TrackCodex accounts.{" "}
                <a href="#" className="text-blue-600 hover:underline">
                    Learn more about enterprise types
                    <span className="material-symbols-outlined align-middle text-[14px] ml-1">open_in_new</span>
                </a>
                .
            </p>

            <div className="space-y-6">
                <div className="border border-gh-border rounded-md p-6 hover:border-gh-text-secondary transition-colors">
                    <div className="inline-block px-2 py-0.5 border border-gh-border rounded-full text-xs font-medium text-gh-text-secondary mb-3">
                        Recommended for public and private work
                    </div>
                    <h3 className="text-base font-bold text-gh-text mb-2">Enterprise with personal accounts</h3>
                    <p className="text-sm text-gh-text-secondary mb-6">
                        For public, open source and private work, that allows members to access your repositories with their personal TrackCodex accounts.
                    </p>
                    <button
                        onClick={() => onSelect("personal")}
                        className="bg-[#1f883d] hover:bg-[#1a7f37] text-white px-4 py-2 rounded-md text-sm font-bold transition-colors shadow-sm"
                    >
                        Get started with personal accounts
                    </button>
                </div>

                <div className="border border-gh-border rounded-md p-6 hover:border-gh-text-secondary transition-colors">
                    <div className="inline-block px-2 py-0.5 border border-gh-border rounded-full text-xs font-medium text-gh-text-secondary mb-3">
                        Recommended for internal work
                    </div>
                    <h3 className="text-base font-bold text-gh-text mb-2">Enterprise with managed users</h3>
                    <p className="text-sm text-gray-600 mb-6">
                        For private and internal work only, with member accounts provisioned from your identity provider.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gh-text-secondary mb-6">
                        <span className="material-symbols-outlined !text-[18px]">globe</span>
                        Choose which geographical location to store your data
                    </div>
                    <button
                        onClick={() => onSelect("managed")}
                        className="bg-gh-bg-secondary hover:bg-gh-bg-tertiary text-gh-text border border-gh-border px-4 py-2 rounded-md text-sm font-bold transition-colors shadow-sm"
                    >
                        Get started with managed users
                    </button>
                </div>
            </div>
        </div>
    );
};

// Step 2: Signup Form
const EnterpriseSignupForm = ({ type, slug: initialSlug }: { type: string; slug?: string }) => {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState(initialSlug || "");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!name || !slug) return;

        setLoading(true);
        try {
            await enterpriseApi.create({ name, slug });
            // Navigate to the newly created enterprise dashboard
            navigate(`/enterprise/${slug}`);
            // Force a reload to refresh context/sidebar if needed, or just navigate
            // Ideally we should update some global state, but a navigate usually triggers a re-fetch in the target component
            window.location.href = `#/enterprise/${slug}`;
            window.location.reload();

        } catch (error) {
            console.error("Failed to create enterprise", error);
            alert("Failed to create enterprise. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto pt-16 px-8 pb-12">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gh-text mb-2">Sign up for Enterprise Cloud</h2>
                <p className="text-sm text-gh-text-secondary">
                    For {type === "personal" ? "public, open source and private work" : "private and internal work"}, that allows members to access your repositories with their {type === "personal" ? "personal TrackCodex accounts" : "managed accounts"}.{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                        Learn more about Enterprise Cloud
                        <span className="material-symbols-outlined align-middle text-[14px] ml-1">open_in_new</span>
                    </a>
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="ent-name" className="block text-sm font-bold text-gh-text mb-2">Enterprise name *</label>
                    <input
                        id="ent-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                        placeholder="e.g. Acme, Inc."
                    />
                </div>

                <div>
                    <label htmlFor="ent-slug" className="block text-sm font-bold text-gh-text mb-2">Enterprise URL slug *</label>
                    <div className="flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gh-border bg-gh-bg-secondary text-gh-text-secondary text-sm">
                            slug
                        </span>
                        <input
                            id="ent-slug"
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="flex-1 min-w-0 block w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-r-md text-gh-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-sans"
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">This will be your enterprise profile URL.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="ent-industry" className="block text-sm font-bold text-gh-text mb-2">Industry *</label>
                        <select id="ent-industry" className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>Select an option</option>
                            <option>Technology</option>
                            <option>Finance</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="ent-employees" className="block text-sm font-bold text-gh-text mb-2">Number of employees *</label>
                        <select id="ent-employees" className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>Select an option</option>
                            <option>1-100</option>
                            <option>100-500</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="ent-contracts" className="block text-sm font-bold text-gh-text mb-2">Organization</label>
                    <select id="ent-contracts" className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>Choose an existing organization to include in this new enterprise account</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                        Note: Billing for any selected organization will be delegated to the enterprise account.{" "}
                        <a href="#" className="text-blue-600 hover:underline">Learn about changes to your billing during trial</a>
                    </p>
                </div>

                <div className="pt-4 border-t border-gh-border mt-6">
                    <h3 className="text-base font-bold text-gh-text mb-4">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="admin-name" className="block text-sm font-bold text-gh-text mb-2">Admin name *</label>
                            <input id="admin-name" type="text" className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="admin-email" className="block text-sm font-bold text-gh-text mb-2">Admin work email *</label>
                            <input id="admin-email" type="email" className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="name@company.com" />
                            <p className="mt-1 text-xs text-gh-text-secondary">This email should send and receive emails.</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="info-country" className="block text-sm font-bold text-gh-text mb-2">Country/Region *</label>
                        <select id="info-country" className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option>Choose your country/region</option>
                            <option>United States</option>
                            <option>Canada</option>
                        </select>
                    </div>
                </div>

                <div className="pt-6">
                    <div className="p-4 bg-gh-bg-secondary border border-gh-border rounded-md">
                        <h4 className="text-sm font-bold text-gh-text mb-2">Verify your account</h4>
                        <div className="bg-gh-bg border border-gh-border rounded p-8 text-center shadow-sm">
                            <h5 className="font-bold text-gh-text mb-4">Protecting your account</h5>
                            <p className="text-sm text-gh-text-secondary mb-4">Please solve this puzzle so we know you are a real person</p>
                            <button className="bg-gh-bg-tertiary text-white px-6 py-2 rounded font-bold text-sm hover:bg-gh-bg-secondary border border-gh-border">Verify</button>
                        </div>
                    </div>
                </div>

                <div className="pt-4 text-xs text-gh-text-secondary space-y-4">
                    <label className="flex items-start gap-2">
                        <input type="checkbox" className="mt-0.5" />
                        <span>I understand that <a href="#" className="text-blue-600 hover:underline">certain features</a> are unavailable during the trial experience.</span>
                    </label>
                    <label className="flex items-start gap-2">
                        <input type="checkbox" className="mt-0.5" />
                        <span>If my organization does not already have a customer agreement for TrackCodex services, I hereby accept the <a href="#" className="text-blue-600 hover:underline">TrackCodex Customer Agreement</a> and confirm that I have the authority to do so on behalf of my organization.</span>
                    </label>

                    <div>
                        <p className="font-bold mb-2">Communication preferences</p>
                        <label className="flex items-start gap-2">
                            <input type="checkbox" className="mt-0.5" />
                            <span>Yes please, I'd like TrackCodex and affiliates to use my information for personalized communications, targeted advertising and campaign effectiveness. See the <a href="#" className="text-blue-600 hover:underline">Privacy Statement</a> for more details.</span>
                        </label>
                        <p className="mt-1 ml-5 text-gh-text-secondary">If you change your mind, you can <a href="#" className="text-blue-600 hover:underline">unsubscribe</a> at any time.</p>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !name || !slug}
                        className={`w-full bg-[#1f883d] hover:bg-[#1a7f37] text-white py-3 rounded-md font-bold transition-colors shadow-sm ${loading || !name || !slug ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? "Creating..." : "Create enterprise"}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function EnterpriseOnboarding({ slug }: { slug?: string }) {
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedType, setSelectedType] = useState<string | null>(null);

    const handleTypeSelect = (type: string) => {
        setSelectedType(type);
        setStep(2);
    };

    return (
        <div className="flex min-h-screen font-sans bg-gh-bg">
            {/* Left Sidebar - Dark */}
            <div className="w-[45%] bg-gh-bg-secondary text-gh-text p-12 hidden lg:block relative overflow-hidden">
                {/* Background Mesh Gradients */}
                <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/40 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-blue-900/30 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="inline-block px-3 py-1 text-xs font-semibold border border-purple-500/50 rounded-full text-purple-200 mb-8 bg-purple-900/20">
                        30-day free trial
                    </div>

                    <h1 className="text-4xl font-bold mb-4 tracking-tight text-gh-text">Unlock TrackCodex's premium features</h1>
                    <p className="text-gh-text-secondary mb-10 text-sm">What you get in your premium free trial:</p>

                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-gh-text !text-[20px] mt-0.5">check</span>
                            <div>
                                <span className="font-bold text-sm text-gh-text">Enterprise:</span>
                                <span className="text-gh-text-secondary text-sm ml-1">Seamlessly plan, build, and ship great software with an extensible DevOps platform</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-gh-text !text-[20px] mt-0.5">check</span>
                            <div>
                                <span className="font-bold text-sm text-gh-text">ForgeAI Business:</span>
                                <span className="text-gh-text-secondary text-sm ml-1">Improve the developer experience with contextualized, AI-powered coding assistance</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-gh-text !text-[20px] mt-0.5">check</span>
                            <div>
                                <span className="font-bold text-sm text-gh-text">Advanced Security:</span>
                                <span className="text-gh-text-secondary text-sm ml-1">Spend less time fixing security vulnerabilities with AI-powered AppSec tools</span>
                            </div>
                        </li>
                    </ul>

                    <div className="absolute bottom-12 left-12 flex gap-8">
                        <div className="p-4 bg-gh-bg-tertiary/80 backdrop-blur rounded-xl border border-gh-border shadow-xl w-16 h-16 flex items-center justify-center transform rotate-[-10deg]">
                            <span className="material-symbols-outlined !text-3xl text-gh-text">code</span>
                        </div>
                        <div className="p-4 bg-gh-bg-tertiary/80 backdrop-blur rounded-xl border border-gh-border shadow-xl w-16 h-16 flex items-center justify-center transform rotate-[5deg] translate-y-[-20px]">
                            <span className="material-symbols-outlined !text-3xl text-blue-400">shield</span>
                        </div>
                        <div className="p-4 bg-gh-bg-tertiary/80 backdrop-blur rounded-xl border border-gh-border shadow-xl w-16 h-16 flex items-center justify-center transform rotate-[15deg]">
                            <span className="material-symbols-outlined !text-3xl text-green-400">smart_toy</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Right Content - Full Dark Theme */}
            <div className="flex-1 bg-gh-bg text-gh-text flex flex-col h-screen overflow-y-auto relative">
                <div className="flex-1">
                    {step === 1 ? (
                        <EnterpriseTypeSelection onSelect={handleTypeSelect} />
                    ) : (
                        <EnterpriseSignupForm type={selectedType!} slug={slug} />
                    )}
                </div>
                <div className="mt-auto border-t border-gh-border">
                    <Footer />
                </div>


            </div>
        </div>
    );
}
