import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_CANDIDATES } from '../../constants';

const WorkflowStep = ({ step, status, label, date, last = false }: { step: number; status: 'approved' | 'pending' | 'waiting'; label: string; date: string; last?: boolean; }) => {
    const statusConfig = {
        approved: { icon: 'check_circle', color: 'text-emerald-500', line: 'bg-emerald-500' },
        pending: { icon: 'hourglass_top', color: 'text-amber-500', line: 'bg-amber-500' },
        waiting: { icon: 'radio_button_unchecked', color: 'text-slate-600', line: 'bg-slate-600' }
    };
    const { icon, color, line } = statusConfig[status];

    return (
        <div className="flex gap-4 relative">
            <div className="flex flex-col items-center">
                <div className={`size-8 rounded-full flex items-center justify-center border-2 ${status === 'waiting' ? 'border-slate-600' : `border-current ${color}`}`}>
                    <span className="material-symbols-outlined !text-base">{icon}</span>
                </div>
                {!last && <div className={`w-0.5 flex-1 ${status === 'approved' ? line : 'bg-slate-700'}`}></div>}
            </div>
            <div>
                <p className="font-bold text-sm text-white">{label}</p>
                <p className="text-xs text-slate-400">{date}</p>
            </div>
        </div>
    );
};


const OfferEditorView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const candidate = MOCK_CANDIDATES[0]; // Using Jane Doe as mock

    const [offer, setOffer] = useState({
        baseSalary: '185000',
        equity: '10000',
        signOnBonus: '20000',
        startDate: '2024-10-15',
        reportingManager: 'Alex Rivera',
        officeLocation: 'San Francisco, CA (Hybrid)',
        includeRelocation: true,
        customNda: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setOffer({ ...offer, [e.target.name]: e.target.value });
    };
    
    const handleToggle = (name: 'includeRelocation' | 'customNda') => {
        setOffer({ ...offer, [name]: !offer[name] });
    };

    const formatCurrency = (value: string) => {
        const num = parseInt(value, 10);
        return isNaN(num) ? '$0' : `$${num.toLocaleString()}`;
    };
    
    const formatNumber = (value: string) => {
        const num = parseInt(value, 10);
        return isNaN(num) ? '0' : num.toLocaleString();
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' });
        } catch (e) {
            return "Invalid Date";
        }
    };


    return (
        <div className="h-full flex flex-col bg-[#0d1117] text-slate-300 font-display -m-8">
            <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-[#161b22] border-b border-gh-border">
                <h1 className="text-lg font-bold text-white">TrackCodex Offer Editor</h1>
                <div className="flex items-center gap-3">
                    <button className="text-sm font-medium text-slate-400 hover:text-white">Candidates</button>
                    <button className="text-sm font-medium text-slate-400 hover:text-white">Templates</button>
                    <div className="w-px h-6 bg-gh-border mx-2"></div>
                    <button className="px-4 py-1.5 text-sm font-bold bg-gh-bg-secondary border border-gh-border rounded-lg text-white hover:bg-slate-700">Save Draft</button>
                    <button 
                        onClick={() => navigate(`/offer/${id}/accept`)}
                        className="px-4 py-1.5 text-sm font-bold bg-primary text-white rounded-lg hover:bg-blue-600">Send Offer</button>
                </div>
            </header>

            <div className="flex-1 flex min-h-0">
                {/* Left Sidebar */}
                <aside className="w-[320px] p-6 border-r border-gh-border flex flex-col gap-8 shrink-0">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <img src={candidate.avatar} alt={candidate.name} className="size-12 rounded-full" />
                            <div>
                                <h2 className="font-bold text-white text-lg">{candidate.name}</h2>
                                <p className="text-sm text-slate-400">{candidate.role}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-gh-bg-secondary border border-gh-border rounded-lg">
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Final Scorecard</p>
                            <p className="text-3xl font-black text-white">4.8<span className="text-lg text-slate-500">/5</span></p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Approval Workflow</h3>
                        <div className="space-y-4">
                            <WorkflowStep step={1} status="approved" label="HR Review" date="Approved by Sarah K." />
                            <WorkflowStep step={2} status="approved" label="Dept Head Approval" date="Approved by Alex R." />
                            <WorkflowStep step={3} status="waiting" label="Finance Verification" date="Waiting" last />
                        </div>
                    </div>
                </aside>

                {/* Main Editor */}
                <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    <h2 className="text-2xl font-bold text-white mb-2">Offer Details & Terms</h2>
                    <p className="text-slate-400 mb-8">Configure the compensation and logistics for the candidate.</p>
                    
                    <div className="space-y-8 max-w-xl">
                        {/* Compensation */}
                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Compensation</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-300">Base Salary</label>
                                    <div className="flex items-center">
                                        <span className="px-3 py-2 bg-gh-bg-secondary border border-r-0 border-gh-border rounded-l-lg text-sm">USD</span>
                                        <input type="text" name="baseSalary" value={offer.baseSalary} onChange={handleChange} className="w-full bg-[#0d1117] border border-gh-border rounded-r-lg px-3 py-2 text-sm text-white focus:ring-primary focus:border-primary" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-slate-300">Equity (Options)</label>
                                        <input type="text" name="equity" value={offer.equity} onChange={handleChange} className="w-full bg-[#0d1117] border border-gh-border rounded-lg px-3 py-2 text-sm text-white focus:ring-primary focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-slate-300">Sign-on Bonus</label>
                                        <input type="text" name="signOnBonus" value={offer.signOnBonus} onChange={handleChange} className="w-full bg-[#0d1117] border border-gh-border rounded-lg px-3 py-2 text-sm text-white focus:ring-primary focus:border-primary" />
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* Logistics */}
                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Logistics</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-300">Start Date</label>
                                    <input type="date" name="startDate" value={offer.startDate} onChange={handleChange} className="w-full bg-[#0d1117] border border-gh-border rounded-lg px-3 py-2 text-sm text-white focus:ring-primary focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-300">Reporting Manager</label>
                                    <select name="reportingManager" value={offer.reportingManager} onChange={handleChange} className="w-full bg-[#0d1117] border border-gh-border rounded-lg px-3 py-2 text-sm text-white focus:ring-primary focus:border-primary">
                                        <option>Alex Rivera</option>
                                        <option>Sarah Chen</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-300">Office Location</label>
                                    <input type="text" name="officeLocation" value={offer.officeLocation} onChange={handleChange} className="w-full bg-[#0d1117] border border-gh-border rounded-lg px-3 py-2 text-sm text-white focus:ring-primary focus:border-primary" />
                                </div>
                            </div>
                        </section>
                        {/* Toggles */}
                        <div className="flex items-center justify-between p-4 bg-gh-bg-secondary border border-gh-border rounded-lg">
                            <label className="font-medium text-white">Include Relocation Package</label>
                            <button onClick={() => handleToggle('includeRelocation')} className={`w-11 h-6 rounded-full relative transition-colors ${offer.includeRelocation ? 'bg-primary' : 'bg-slate-700'}`}>
                                <span className={`absolute top-1 size-4 bg-white rounded-full transition-transform ${offer.includeRelocation ? 'translate-x-6' : 'translate-x-1'}`}></span>
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gh-bg-secondary border border-gh-border rounded-lg">
                            <label className="font-medium text-white">Custom NDA Required</label>
                            <button onClick={() => handleToggle('customNda')} className={`w-11 h-6 rounded-full relative transition-colors ${offer.customNda ? 'bg-primary' : 'bg-slate-700'}`}>
                                <span className={`absolute top-1 size-4 bg-white rounded-full transition-transform ${offer.customNda ? 'translate-x-6' : 'translate-x-1'}`}></span>
                            </button>
                        </div>
                    </div>
                </main>

                {/* Preview Panel */}
                <aside className="w-[600px] bg-black p-8 shrink-0 flex flex-col items-center">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-base">visibility</span> Live Offer Preview</p>
                    <div className="w-full bg-white text-slate-800 p-10 rounded-lg shadow-2xl flex-1 overflow-y-auto text-sm leading-relaxed">
                        <header className="flex items-start justify-between mb-8">
                            <div className="size-10 bg-black rounded-lg"></div>
                            <div className="text-right text-xs text-slate-600">
                                <p className="font-bold">TRACKCODEX INC.</p>
                                <p>123 Tech Plaza, Suite 400</p>
                                <p>San Francisco, CA 94105</p>
                            </div>
                        </header>
                        <p className="mb-4">Date: {formatDate(new Date().toISOString())}</p>
                        <p className="mb-4">{candidate.name}<br />Candidate ID: #TCX-4920</p>
                        <h3 className="font-bold text-lg mb-4">Offer of Employment</h3>
                        <p className="mb-4">Dear {candidate.name.split(' ')[0]},</p>
                        <p className="mb-4">We are thrilled to offer you the position of <span className="font-bold text-blue-600">{candidate.role}</span> at TrackCodex. Your background and technical skills stood out to us during the interview process, and we believe you will be a valuable addition to our engineering organization.</p>
                        <div className="my-6 grid grid-cols-2 gap-x-8 gap-y-2 border-y py-4">
                            <strong className="text-slate-500">Base Salary:</strong> <span className="font-bold">{formatCurrency(offer.baseSalary)} per annum</span>
                            <strong className="text-slate-500">Stock Options:</strong> <span className="font-bold">{formatNumber(offer.equity)} shares</span>
                            <strong className="text-slate-500">Sign-on Bonus:</strong> <span className="font-bold">{formatCurrency(offer.signOnBonus)}</span>
                            <strong className="text-slate-500">Start Date:</strong> <span className="font-bold">{formatDate(offer.startDate)}</span>
                            <strong className="text-slate-500">Reporting Manager:</strong> <span className="font-bold">{offer.reportingManager}</span>
                        </div>
                        <p className="mb-4">This position is located in our <span className="font-bold text-blue-600">{offer.officeLocation}</span> office. You will be reporting directly to the VP of Engineering. We look forward to your contributions towards our mission of building the next generation of hiring platforms.</p>
                        <p className="mb-8">Please review the full terms of employment attached to this letter. To accept this offer, please sign and return the documents by September 25, 2024.</p>
                        <p>Sincerely,</p>
                        <p className="mt-6 font-bold">Sarah Jenkins<br />Head of People, TrackCodex</p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default OfferEditorView;
