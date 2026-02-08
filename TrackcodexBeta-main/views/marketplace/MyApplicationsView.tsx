import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyApplicationsView = () => {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Mock API call to get my applications
        // In real app: GET /api/v1/applications/me
        // For now, we simulate emptiness or mock data if we had it.
        // Let's just show an empty state or a mock item for demo feel.

        // Simulate network delay
        setTimeout(() => {
            setApplications([
                { id: '1', job: { id: 'job-123', title: 'AI Core Optimization', budget: '$5,000' }, status: 'Pending', date: '2024-05-20' },
                { id: '2', job: { id: 'job-456', title: 'React Dashboard Refactor', budget: '$2,000' }, status: 'Interview', date: '2024-05-18' }
            ]);
            setLoading(false);
        }, 500);
    }, []);

    return (
        <div className="p-10 max-w-[1200px] mx-auto text-white">
            <h1 className="text-3xl font-black mb-2 tracking-tight">My Applications</h1>
            <p className="text-slate-500 font-medium mb-10">Track the status of your active proposals.</p>

            {loading ? (
                <div className="text-slate-500">Loading...</div>
            ) : (
                <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#0d1117] text-slate-400 font-medium uppercase text-xs">
                            <tr>
                                <th className="p-4 pl-6">Mission</th>
                                <th className="p-4">Applied</th>
                                <th className="p-4">Budget</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]">
                            {applications.map(app => (
                                <tr key={app.id} className="hover:bg-[#1f242c] transition-colors group">
                                    <td className="p-4 pl-6 font-bold text-white group-hover:text-blue-400 cursor-pointer" onClick={() => navigate(`/marketplace/missions/${app.job.id}`)}>
                                        {app.job.title}
                                    </td>
                                    <td className="p-4 text-slate-400">{app.date}</td>
                                    <td className="p-4 font-mono text-slate-300">{app.job.budget}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${app.status === 'Interview' ? 'bg-amber-500/20 text-amber-500' :
                                                app.status === 'Accepted' ? 'bg-emerald-500/20 text-emerald-500' :
                                                    'bg-slate-500/20 text-slate-400'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-slate-500 hover:text-white font-bold text-xs">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyApplicationsView;
