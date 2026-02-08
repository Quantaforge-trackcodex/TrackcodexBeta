import React, { useState } from 'react';
import Footer from '../../components/layout/Footer';

export default function EnterpriseBilling() {
    const [formData, setFormData] = useState({
        businessName: 'quantaforge',
        vatId: '',
        address: '',
        address2: '',
        city: '',
        postalCode: '',
        country: 'India',
        state: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gh-bg text-gh-text-secondary font-sans flex flex-col">
            {/* Header */}
            <header className="py-6 px-4 border-b border-gh-border bg-gh-bg-secondary">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-xl font-semibold text-gh-text">Verify your identity to activate the Copilot Business trial</h1>
                    <p className="text-sm text-gh-text-secondary mt-1">
                        The trial is risk-free, but validating a payment method builds trust.
                    </p>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex gap-8">
                {/* Left Column - Form */}
                <div className="flex-1">
                    <section className="mb-8">
                        <h2 className="text-base font-semibold text-gh-text mb-4 pb-2 border-b border-gh-border">Billing information</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="business-name" className="block text-xs font-semibold text-gh-text mb-1">Business/institution name *</label>
                                    <input
                                        id="business-name"
                                        type="text"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        className="w-full bg-gh-bg border border-gh-border rounded px-3 py-2 text-sm text-gh-text focus:ring-2 focus:ring-[#58a6ff] focus:border-[#58a6ff] outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="vat-id" className="block text-xs font-semibold text-gh-text mb-1">VAT/GST ID</label>
                                    <input
                                        id="vat-id"
                                        type="text"
                                        name="vatId"
                                        value={formData.vatId}
                                        onChange={handleChange}
                                        className="w-full bg-gh-bg border border-gh-border rounded px-3 py-2 text-sm text-gh-text focus:ring-2 focus:ring-[#58a6ff] focus:border-[#58a6ff] outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="address-1" className="block text-xs font-semibold text-gh-text mb-1">Address (Street, P.O. box) *</label>
                                <input
                                    id="address-1"
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full bg-gh-bg border border-gh-border rounded px-3 py-2 text-sm text-gh-text focus:ring-2 focus:ring-[#58a6ff] focus:border-[#58a6ff] outline-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="address-2" className="block text-xs font-semibold text-gh-text mb-1">Address line 2 (Apartment, suite, unit)</label>
                                <input
                                    id="address-2"
                                    type="text"
                                    name="address2"
                                    value={formData.address2}
                                    onChange={handleChange}
                                    className="w-full bg-gh-bg border border-gh-border rounded px-3 py-2 text-sm text-gh-text focus:ring-2 focus:ring-[#58a6ff] focus:border-[#58a6ff] outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="city" className="block text-xs font-semibold text-gh-text mb-1">City *</label>
                                    <input
                                        id="city"
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full bg-gh-bg border border-gh-border rounded px-3 py-2 text-sm text-gh-text focus:ring-2 focus:ring-[#58a6ff] focus:border-[#58a6ff] outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="postal-code" className="block text-xs font-semibold text-gh-text mb-1">Postal/Zip code</label>
                                    <input
                                        id="postal-code"
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className="w-full bg-gh-bg border border-gh-border rounded px-3 py-2 text-sm text-gh-text focus:ring-2 focus:ring-[#58a6ff] focus:border-[#58a6ff] outline-none"
                                    />
                                    <p className="text-[10px] text-gh-text-secondary mt-0.5">Required for certain countries</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="country" className="block text-xs font-semibold text-gh-text mb-1">Country/Region *</label>
                                    <select
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full bg-gh-bg border border-gh-border rounded px-3 py-2 text-sm text-gh-text focus:ring-2 focus:ring-[#58a6ff] focus:border-[#58a6ff] outline-none"
                                    >
                                        <option value="India">India</option>
                                        <option value="United States">United States</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="state" className="block text-xs font-semibold text-gh-text mb-1">State/Province</label>
                                    <input
                                        id="state"
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full bg-gh-bg border border-gh-border rounded px-3 py-2 text-sm text-gh-text focus:ring-2 focus:ring-[#58a6ff] focus:border-[#58a6ff] outline-none"
                                    />
                                    <p className="text-[10px] text-gh-text-secondary mt-0.5">Required for certain countries</p>
                                </div>
                            </div>

                            <button className="mt-4 px-4 py-2 bg-[#238636] hover:bg-[#2eaa3a] text-white rounded-md font-medium text-sm transition-colors border border-gh-border">
                                Save billing information
                            </button>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-base font-semibold text-gh-text mb-4 pb-2 border-b border-gh-border">Shipping information</h2>
                        <div className="p-4 border border-gh-border rounded bg-gh-bg-secondary text-sm text-gh-text-secondary">
                            You have not added billing information for your account.
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-base font-semibold text-gh-text mb-4 pb-2 border-b border-gh-border">Payment method</h2>
                        <div className="p-4 border border-gh-border rounded bg-gh-bg-secondary text-sm text-gh-text-secondary">
                            You have not added billing and shipping information for your account.
                        </div>
                    </section>
                </div>

                {/* Right Column - Info Box */}
                <div className="w-80">
                    <div className="border border-gh-border rounded-md bg-gh-bg-secondary">
                        <div className="p-4">
                            <h3 className="text-sm font-bold text-gh-text mb-2">Build trust with a valid payment method</h3>
                            <p className="text-xs text-gh-text-secondary mb-4 leading-normal">
                                Your payment method may receive a $10 pre-authorization request. This is not a charge.
                            </p>
                            <p className="text-xs text-gh-text-secondary mb-4 leading-normal">
                                Your payment method will not be charged automatically at the end of the trial.
                            </p>

                            <div className="space-y-2">
                                <button className="w-full px-4 py-2 bg-[#238636] hover:bg-[#2eaa3a] text-white rounded-md font-semibold text-sm transition-colors border border-gh-border">
                                    Validate and continue
                                </button>
                                <button className="w-full px-4 py-2 bg-gh-bg-secondary hover:bg-gh-bg text-gh-text border border-gh-border rounded-md font-medium text-sm transition-colors">
                                    Skip for now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <div className="mt-auto border-t border-gh-border">
                <Footer />
            </div>
        </div>
    );
}
