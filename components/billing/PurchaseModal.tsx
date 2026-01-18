import React, { useState } from 'react';

interface PurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [quantity, setQuantity] = useState(1);
    const unitPrice = 9.00;

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        window.dispatchEvent(new CustomEvent('trackcodex-notification', {
            detail: {
                title: 'Purchase Confirmed',
                message: `You've added ${quantity} Standard Workspace(s) to your plan.`,
                type: 'success'
            }
        }));
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div 
                className="bg-[#1c1f26] border border-[#30363d] w-full max-w-md rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <h2 className="text-lg font-bold text-white">Add additional workspaces</h2>
                    <p className="text-sm text-gh-text-secondary mt-1">Expand your team capacity with dedicated workspaces.</p>
                </div>

                <div className="p-6 border-y border-[#30363d] space-y-6">
                    <div>
                        <p className="text-xs font-bold text-gh-text-secondary mb-2">Quantity</p>
                        <div className="flex items-center justify-between p-3 bg-[#161b22] border border-[#30363d] rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="size-8 bg-gh-bg rounded-md flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined !text-xl">view_quilt</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Standard Workspace</p>
                                    <p className="text-xs text-gh-text-secondary">Full collaboration features</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="size-7 bg-[#21262d] rounded text-white">-</button>
                                <span className="w-8 text-center font-mono text-white">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} className="size-7 bg-[#21262d] rounded text-white">+</button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gh-text-secondary">Unit price</span>
                        <span className="font-mono text-white">${unitPrice.toFixed(2)} / workspace / mo</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#30363d]">
                        <span className="text-lg font-bold text-white">Total monthly increase</span>
                        <div className="text-right">
                            <p className="text-lg font-bold text-white">${(quantity * unitPrice).toFixed(2)}</p>
                            <p className="text-xs text-gh-text-secondary">USD per month</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <span className="material-symbols-outlined !text-base text-primary mt-0.5">info</span>
                        <p className="text-xs text-gh-text-secondary leading-relaxed">
                            <span className="font-bold text-white">Billing note:</span> Your card will be charged immediately. Charges for this workspace are prorated based on the 15 days remaining in your current billing cycle.
                        </p>
                    </div>
                </div>

                <div className="p-4 flex justify-end gap-3 bg-[#161b22]">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-gh-text hover:bg-gh-bg-secondary rounded-lg">Cancel</button>
                    <button onClick={handleConfirm} className="px-6 py-2 bg-[#9333ea] text-white text-sm font-bold rounded-lg hover:bg-[#a855f7] shadow-lg shadow-[#9333ea]/20">Confirm Purchase</button>
                </div>
            </div>
        </div>
    );
};

export default PurchaseModal;
