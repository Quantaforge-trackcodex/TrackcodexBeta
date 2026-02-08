import React from 'react';
import { NavLink, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import OnboardingWorkspace from './OnboardingWorkspace';
import BuddyDashboardView from './BuddyDashboardView';

const OnboardingNavItem = ({ to, icon, label }: { to: string, icon: string, label: string }) => (
    <NavLink
        to={to}
        end
        className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                isActive ? 'bg-gh-bg-secondary text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`
        }
    >
        <span className="material-symbols-outlined !text-base">{icon}</span>
        {label}
    </NavLink>
);

const OnboardingLayout = () => {
    const basePath = '/onboarding';

    return (
        <div className="flex-1 flex bg-[#0d1117] font-display">
            <aside className="w-64 p-6 border-r border-gh-border flex flex-col">
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-white">Onboarding Workspace</h2>
                    <p className="text-xs text-slate-500 mt-1">Your first week, Alex!</p>
                </div>
                <nav className="flex flex-col gap-1">
                    <OnboardingNavItem to={`${basePath}/dashboard`} icon="dashboard" label="Dashboard" />
                    <OnboardingNavItem to={`${basePath}/tasks`} icon="task_alt" label="Onboarding" />
                    <OnboardingNavItem to={`${basePath}/repos`} icon="folder_open" label="Repositories" />
                    <OnboardingNavItem to={`${basePath}/wiki`} icon="book" label="Internal Wiki" />
                    <OnboardingNavItem to={`${basePath}/team`} icon="group" label="Engineering Team" />
                </nav>
                 <div className="mt-auto p-4 flex items-center gap-4">
                    <img src="https://picsum.photos/seed/newhire/64" className="size-10 rounded-full" />
                    <div>
                        <p className="text-sm font-bold text-white">Alex Chen</p>
                        <p className="text-xs text-slate-400">New Hire</p>
                    </div>
                    <button className="ml-auto text-slate-400 hover:text-white"><span className="material-symbols-outlined">settings</span></button>
                 </div>
            </aside>
            <main className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-gh-bg">
                <Outlet />
            </main>
        </div>
    );
};

export default OnboardingLayout;
