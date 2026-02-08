import React from 'react';
import { Link } from 'react-router-dom';

interface SetupTaskProps {
    icon: string;
    title: string;
    description: string;
    linkText?: string;
    linkTo?: string;
    completed?: boolean;
    iconColor?: string;
}

const SetupTask: React.FC<SetupTaskProps> = ({ icon, title, description, linkText, linkTo, completed, iconColor = "text-gh-text-secondary" }) => (
    <div className={`flex items-start gap-4 p-4 border rounded-md mb-3 ${completed ? 'bg-gh-bg-secondary border-gh-border' : 'bg-gh-bg-secondary border-gh-border'}`}>
        <div className={`mt-1 flex-shrink-0 ${completed ? 'text-[#3fb950]' : iconColor}`}>
            <span className="material-symbols-outlined text-[20px]">
                {completed ? 'check_circle' : icon}
            </span>
        </div>
        <div className="flex-1">
            <h3 className={`text-[14px] font-semibold ${completed ? 'text-gh-text-secondary line-through' : 'text-gh-text'}`}>
                {title}
            </h3>
            <p className="text-[12px] text-gh-text-secondary mt-1 mb-2 leading-normal">
                {description}
            </p>
            {linkText && linkTo && !completed && (
                <Link to={linkTo} className="text-blue-400 hover:underline text-[12px] font-semibold">
                    {linkText}
                </Link>
            )}
        </div>
    </div>
);

export default function EnterpriseOverview() {
    return (
        <div className="min-h-screen bg-gh-bg text-gh-text font-sans">
            <main className="max-w-5xl mx-auto px-0 py-2">
                {/* Banner */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gh-text mb-2">Welcome to your free 30 day trial!</h1>
                    <p className="text-[14px] text-gh-text-secondary">
                        You've unlocked TrackCodex Enterprise. Explore the top features like Copilot and Advanced Security.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Add members section */}
                    <section>
                        <h2 className="text-[14px] font-semibold text-gh-text mb-3">Add members</h2>
                        <SetupTask
                            icon="person_add"
                            title="Invite owners"
                            description="Invite people to manage your enterprise."
                            linkText="Invite owners"
                            linkTo="people"
                            iconColor="text-[#d29922]"
                        />
                        <SetupTask
                            icon="group_add"
                            title="Invite enterprise members"
                            description="Invite people to join your enterprise."
                            linkText="Invite members"
                            linkTo="people"
                            iconColor="text-[#d29922]"
                        />
                    </section>

                    {/* Copilot section */}
                    <section>
                        <h2 className="text-[14px] font-semibold text-gh-text mb-3">Copilot</h2>
                        <SetupTask
                            icon="smart_toy"
                            title="Verify your identity to use Copilot"
                            description="Secure your account to start using Copilot. Unlock AI-powered coding for your team."
                            linkText="Verify identity"
                            linkTo="/enterprise/billing"
                            iconColor="text-[#a371f7]"
                        />
                        <SetupTask
                            icon="lock_person"
                            title="Before you add members to Copilot, you must verify your identity"
                            description="Enable your team to try Copilot. Boost productivity by 55% with AI-powered code suggestions and Copilot chat."
                            linkText="Enable Copilot"
                            linkTo="/enterprise/billing"
                            iconColor="text-gh-text-secondary"
                        />
                    </section>

                    {/* Security section */}
                    <section>
                        <h2 className="text-[14px] font-semibold text-gh-text mb-3">Security</h2>
                        <SetupTask
                            icon="gpp_good"
                            title="Try Secret Scanning"
                            description="Protect your code by scanning repositories for exposed credentials and secrets before they become a risk."
                            linkText="Enable Secret Scanning"
                            linkTo="security"
                            iconColor="text-blue-400"
                        />
                        <SetupTask
                            icon="security"
                            title="Try Code Security"
                            description="Find and fix security issues early with automated scanning and insights."
                            linkText="Enable Code Security"
                            linkTo="security"
                            iconColor="text-blue-400"
                        />
                    </section>

                    {/* Further Setup section */}
                    <section>
                        <h2 className="text-[14px] font-semibold text-gh-text mb-3">Further Enterprise setup</h2>
                        <SetupTask
                            title="Enable SAML Single Sign-On"
                            icon="shield_lock"
                            description="Improve security with SAML SSO. Simplify logins while maintaining control."
                            linkText="Configure SSO"
                            linkTo="settings"
                            iconColor="text-[#f78166]"
                        />
                    </section>

                    {/* Enterprise README section */}
                    <section>
                        <h2 className="text-[14px] font-semibold text-gh-text mb-3">Enterprise README</h2>
                        <SetupTask
                            icon="article"
                            title="Write a README"
                            description="Help your team get started with your Enterprise setup. Share key guidelines, and best practices, all in one place."
                            linkText="Create README"
                            linkTo="settings"
                            iconColor="text-gh-text-secondary"
                        />
                    </section>

                    {/* Completed tasks section */}
                    <section>
                        <h2 className="text-[14px] font-semibold text-gh-text mb-3">Completed tasks</h2>
                        <SetupTask
                            icon="check_circle"
                            title="You added an organization"
                            description="You have already added an organization, you can add members to your enterprise by inviting them to your organization."
                            completed={true}
                        />
                    </section>
                </div>
            </main>
        </div>
    );
}
