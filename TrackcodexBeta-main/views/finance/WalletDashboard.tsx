import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
interface Transaction {
    id: string;
    amount: number;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'ESCROW_HOLD' | 'RELEASE' | 'PAYOUT';
    description: string;
    status: string;
    createdAt: string;
}

interface WalletData {
    currency: string;
    available: number;
    in_escrow: number;
}

const WalletDashboard = () => {
    const [balance, setBalance] = useState<WalletData>({ currency: 'USD', available: 0, in_escrow: 0 });
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [depositAmount, setDepositAmount] = useState('1000');

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        try {
            // 1. Get Balance
            const balRes = await fetch('http://localhost:4000/api/v1/wallet/balance', { headers: { 'x-user-id': 'user-1' } });
            const balData = await balRes.json();
            setBalance(balData);

            // 2. Get Transactions
            const txRes = await fetch('http://localhost:4000/api/v1/wallet/transactions', { headers: { 'x-user-id': 'user-1' } });
            const txData = await txRes.json();
            setTransactions(txData);

            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const handleDeposit = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/v1/wallet/deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': 'user-1'
                },
                body: JSON.stringify({ amount: parseFloat(depositAmount) })
            });
            if (res.ok) {
                setIsDepositModalOpen(false);
                fetchWalletData(); // Refresh
            }
        } catch (e) {
            console.error(e);
        }
    };

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <div className="p-10 max-w-[1200px] mx-auto text-white">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-3xl font-black mb-2 tracking-tight">Financial Overview</h1>
                    <p className="text-slate-500 font-medium">Manage your earnings, deposits, and escrow.</p>
                </div>
                <button
                    onClick={() => setIsDepositModalOpen(true)}
                    className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-white/10"
                >
                    + Add Funds
                </button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Total Balance */}
                <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1c1c1c] to-[#161616] border border-[#333] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-9xl">account_balance_wallet</span>
                    </div>
                    <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">Total Available</h3>
                    <div className="text-4xl font-black tracking-tighter text-white">
                        {loading ? '...' : formatMoney(balance.available)}
                    </div>
                </div>

                {/* In Escrow */}
                <div className="p-8 rounded-3xl bg-[#161b22] border border-[#30363d] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <span className="material-symbols-outlined text-9xl">lock</span>
                    </div>
                    <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">Locked in Escrow</h3>
                    <div className="text-4xl font-black tracking-tighter text-blue-400">
                        {loading ? '...' : formatMoney(balance.in_escrow)}
                    </div>
                </div>

                {/* Lifetime Earnings */}
                <div className="p-8 rounded-3xl bg-[#161b22] border border-[#30363d] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <span className="material-symbols-outlined text-9xl">trending_up</span>
                    </div>
                    <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">Lifetime Volume</h3>
                    <div className="text-4xl font-black tracking-tighter text-emerald-400">
                        $0.00
                    </div>
                </div>
            </div>

            {/* Transactions */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-[#30363d] flex justify-between items-center">
                    <h3 className="font-bold text-lg">Transaction History</h3>
                    <button className="text-sm text-slate-400 hover:text-white">View All</button>
                </div>
                {transactions.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No transactions yet.
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#0d1117] text-slate-400 font-medium uppercase text-xs">
                            <tr>
                                <th className="p-4 pl-6">Type</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 pr-6 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]">
                            {transactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-[#1f242c] transition-colors">
                                    <td className="p-4 pl-6">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${tx.type === 'DEPOSIT' ? 'bg-emerald-500/20 text-emerald-400' :
                                                tx.type === 'WITHDRAWAL' ? 'bg-rose-500/20 text-rose-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="p-4 font-medium text-slate-200">{tx.description}</td>
                                    <td className="p-4 text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                    <td className={`p-4 pr-6 text-right font-mono font-bold ${tx.type === 'DEPOSIT' || tx.type === 'RELEASE' ? 'text-emerald-400' : 'text-slate-200'
                                        }`}>
                                        {tx.type === 'DEPOSIT' ? '+' : ''}{formatMoney(tx.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Deposit Modal */}
            {isDepositModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 w-[400px] shadow-2xl relative">
                        <button onClick={() => setIsDepositModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
                        <h2 className="text-xl font-black mb-6">Deposit Funds</h2>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Amount (USD)</label>
                            <input
                                type="number"
                                value={depositAmount}
                                onChange={e => setDepositAmount(e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-white text-lg font-mono focus:border-blue-500 outline-none"
                            />
                        </div>

                        <div className="p-4 bg-emerald-900/20 border border-emerald-900/50 rounded-lg mb-6 flex gap-3 items-start">
                            <span className="material-symbols-outlined text-emerald-500">encrypted</span>
                            <div>
                                <p className="text-sm font-bold text-emerald-400">Secure Simulation</p>
                                <p className="text-xs text-emerald-300/80 mt-1">This is a sandbox environment. No real money will be charged.</p>
                            </div>
                        </div>

                        <button
                            onClick={handleDeposit}
                            className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200"
                        >
                            Confirm Deposit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletDashboard;
