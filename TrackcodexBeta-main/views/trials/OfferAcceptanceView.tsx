import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const OfferHighlight = ({ value, label, sublabel, icon }: { value: string; label: string; sublabel: string; icon: string; }) => (
    <div className="bg-[#161b22] p-5 rounded-xl border border-[#30363d]">
        <div className="flex items-center gap-3 mb-3">
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <span className="material-symbols-outlined !text-xl">{icon}</span>
            </div>
            <p className="text-xl font-black text-white">{value}</p>
        </div>
        <p className="text-sm font-semibold text-slate-300">{label}</p>
        <p className="text-xs text-slate-500">{sublabel}</p>
    </div>
);

const OfferAcceptanceView = () => {
    const { offerId } = useParams();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(',', '');
    
    const team = [
        { name: 'Sarah Chen', role: 'Staff Engineer', pairedOn: 'Oct 12', avatar: 'https://picsum.photos/seed/sarah/64' },
        { name: 'Marcus Lopez', role: 'Vanquisher Architect', pairedOn: 'Oct 14', avatar: 'https://picsum.photos/seed/marcus/64' },
        { name: 'Jamie Kim', role: 'Frontend Lead', pairedOn: 'Oct 15', avatar: 'https://picsum.photos/seed/jamiekim/64' }
    ];

    const perks = [
        { icon: 'home', text: '$2,500 Home Office Stipend' },
        { icon: 'flight', text: 'Annual Company Retreats (Japan 2024!)' },
        { icon: 'spa', text: 'Monthly Wellness Reimbursement' },
        { icon: 'public', text: 'Work from anywhere policy' },
    ];

    const handleAccept = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim()) {
            alert('Please enter your full legal name to sign.');
            return;
        }
        // In a real app, this would submit to a backend.
        // For now, let's navigate to a success page.
        navigate(`/trials/submitted/${offerId}`);
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-slate-300 font-display p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex items-start justify-between mb-8">
                    <div>
                        <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Ready for Review</p>
                        <h1 className="text-5xl font-black text-white mt-2">Congratulations, Alex!</h1>
                        <p className="text-2xl text-slate-400 mt-2">Your offer from <span className="text-emerald-300 font-bold">TechFlow</span> is ready.</p>
                    </div>
                    <div className="text-right">
                        <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg flex items-center gap-2">
                            <span className="material-symbols-outlined !text-base">download</span> Download PDF
                        </button>
                        <p className="text-xs text-slate-500 mt-2">Valid until Oct 24, 2024</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                    {/* Main Content */}
                    <div className="space-y-8">
                        <div className="grid grid-cols-3 gap-6">
                            <OfferHighlight value="$185,000" label="Annual Base Salary" sublabel="USD" icon="payments" />
                            <OfferHighlight value="0.15% Equity" label="Stock Options" sublabel="4-year vesting schedule" icon="trending_up" />
                            <OfferHighlight value="Gold Tier" label="Health, Dental, & Vision" sublabel="Premium Benefits" icon="health_and_safety" />
                        </div>

                        {/* Document Viewer */}
                        <div className="bg-[#161b22] border border-gh-border rounded-xl overflow-hidden">
                            <div className="p-4 bg-black/20 border-b border-gh-border flex items-center justify-between">
                                <p className="text-sm font-mono text-slate-400">Employment_Agreement_Alex_TechFlow.pdf</p>
                                <div className="flex items-center gap-2">
                                    <button className="text-slate-500 hover:text-white"><span className="material-symbols-outlined !text-base">zoom_in</span></button>
                                    <button className="text-slate-500 hover:text-white"><span className="material-symbols-outlined !text-base">zoom_out</span></button>
                                    <button className="text-slate-500 hover:text-white"><span className="material-symbols-outlined !text-base">fullscreen</span></button>
                                </div>
                            </div>
                            <div className="p-8 h-[600px] overflow-y-auto custom-scrollbar text-slate-900 bg-white">
                                <h2 className="text-2xl font-bold mb-6 text-black">OFFER OF EMPLOYMENT</h2>
                                <div className="space-y-4 text-base leading-relaxed">
                                    <p>Dear Alex,</p>
                                    <p>We are thrilled to offer you the position of <strong className="text-black">Senior Software Engineer</strong> at <strong className="text-black">TechFlow</strong>. Your technical skills and contributions during the trial phase impressed the entire team.</p>
                                    <p><strong className="text-black">1. Position and Duties:</strong> You will report to the VP of Engineering. Your duties will include leading the core infrastructure squad, mentoring junior engineers, and contributing to our architectural roadmap.</p>
                                    <p><strong className="text-black">2. Compensation:</strong> Your starting base salary will be $185,000 per annum, payable in semi-monthly installments. You will also be eligible for a performance-based bonus of up to 15%.</p>
                                    <p><strong className="text-black">3. Equity:</strong> Subject to approval by the Board of Directors, you will be granted an option to purchase 2,500 shares of Common Stock. These options will vest over a four-year period with a one-year cliff.</p>
                                    <p><strong className="text-black">4. Benefits:</strong> TechFlow provides a comprehensive benefits package, including unlimited PTO (with a 3-week minimum), premium health coverage, and a $2,000 annual learning stipend.</p>
                                    <p>Please review this document carefully. By signing below, you agree to the terms and conditions outlined in this agreement and our standard employee handbook.</p>
                                </div>
                            </div>
                        </div>

                        {/* Acceptance Form */}
                        <div className="bg-emerald-900/50 border border-emerald-500/30 rounded-xl p-8">
                            <div className="flex items-center gap-3 mb-4">
                               <span className="material-symbols-outlined !text-xl text-emerald-400">edit</span>
                               <h3 className="text-lg font-bold text-white">Ready to join the team?</h3>
                            </div>
                            <p className="text-sm text-emerald-200 mb-6">By typing your name below, you are providing a legally binding electronic signature.</p>
                            <form onSubmit={handleAccept} className="grid grid-cols-[1fr_200px] gap-4">
                                <div>
                                    <label className="text-xs font-bold text-emerald-300 uppercase">Full Name</label>
                                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Type your full legal name" className="w-full mt-1 bg-emerald-950/50 border border-emerald-500/50 rounded-lg p-3 text-white focus:ring-emerald-400" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-emerald-300 uppercase">Date</label>
                                    <input type="text" readOnly value={today} className="w-full mt-1 bg-emerald-950/50 border border-emerald-500/50 rounded-lg p-3 text-white" />
                                </div>
                            </form>
                            <div className="flex items-center gap-4 mt-6">
                                <button onClick={handleAccept} className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-400">Sign and Accept Offer</button>
                                <button className="text-emerald-200 hover:underline">Decline Offer</button>
                            </div>
                        </div>
                    </div>
                    {/* Right Sidebar */}
                    <aside className="space-y-8">
                        <div className="bg-[#161b22] p-6 rounded-xl border border-gh-border">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">groups</span> Meet Your Team</h3>
                            <p className="text-sm text-slate-400 mb-6">You already crushed the technical trial with these engineers. They're excited to have you back!</p>
                            <div className="space-y-4">
                                {team.map(member => (
                                    <div key={member.name} className="flex items-center gap-3">
                                        <img src={member.avatar} alt={member.name} className="size-10 rounded-full" />
                                        <div>
                                            <p className="font-bold text-sm text-white">{member.name}</p>
                                            <p className="text-xs text-slate-500">{member.role} • Paired {member.pairedOn}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-gh-border text-center italic text-slate-400 text-sm">
                                "Alex's approach to the distributed systems problem during the trial was one of the sharpest we've seen this year."
                                <p className="font-bold text-slate-300 mt-2">- Marcus Lopez</p>
                            </div>
                        </div>
                        <div className="bg-[#161b22] p-6 rounded-xl border border-gh-border">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">redeem</span> Additional Perks</h3>
                            <ul className="space-y-3">
                                {perks.map(perk => (
                                    <li key={perk.text} className="flex items-center gap-3 text-sm text-slate-300">
                                        <span className="material-symbols-outlined text-emerald-500">{perk.icon}</span>
                                        {perk.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <div className="text-center text-sm text-slate-500">
                            Have questions about the vesting schedule or health plans? <a href="#" className="text-primary hover:underline">Schedule a 15-min call</a> with our HR lead, Diana.
                        </div>
                    </aside>
                </div>
                
                <footer className="text-center mt-12 pt-8 border-t border-gh-border text-xs text-slate-600">
                    <p>© {new Date().getFullYear()} TrackCodex Inc. All documents are encrypted and legally binding.</p>
                    <div className="flex items-center justify-center gap-4 mt-4">
                       <a href="#" className="hover:text-slate-400">Privacy Policy</a>
                       <a href="#" className="hover:text-slate-400">Terms of Service</a>
                       <a href="#" className="hover:text-slate-400">Contact Support</a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default OfferAcceptanceView;
