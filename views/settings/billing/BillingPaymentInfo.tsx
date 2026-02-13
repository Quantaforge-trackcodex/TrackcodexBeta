import React, { useState } from "react";

const BillingPaymentInfo = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    addressLine2: "",
    city: "",
    country: "",
    state: "",
    postalCode: "",
    vatId: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-black text-gh-text tracking-tight mb-2">
          Payment information
        </h1>
      </header>

      {/* Billing Information Section */}
      <section className="bg-gh-bg-secondary border border-gh-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-gh-text mb-2">Billing information</h2>
        <p className="text-sm text-gh-text-secondary mb-6">
          Add your information to show on every invoice
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-bold text-gh-text mb-2">
                First name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-lg text-sm text-gh-text focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-bold text-gh-text mb-2">
                Last name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-lg text-sm text-gh-text focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-bold text-gh-text mb-2">
              Address (Street, P.O. box) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-lg text-sm text-gh-text focus:outline-none focus:border-primary"
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label htmlFor="addressLine2" className="block text-sm font-bold text-gh-text mb-2">
              Address line 2 (Apartment, suite, unit)
            </label>
            <input
              type="text"
              id="addressLine2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-lg text-sm text-gh-text focus:outline-none focus:border-primary"
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-bold text-gh-text mb-2">
              City <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-lg text-sm text-gh-text focus:outline-none focus:border-primary"
            />
          </div>

          {/* Country/Region */}
          <div>
            <label htmlFor="country" className="block text-sm font-bold text-gh-text mb-2">
              Country/Region <span className="text-red-400">*</span>
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-lg text-sm text-gh-text focus:outline-none focus:border-primary"
            >
              <option value="">Choose your country/region</option>
              <option value="US">United States</option>
              <option value="IN">India</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="JP">Japan</option>
            </select>
          </div>

          {/* State/Province and Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="state" className="block text-sm font-bold text-gh-text mb-2">
                State/Province
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-lg text-sm text-gh-text focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-gh-text-secondary mt-1">Required for certain countries</p>
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm font-bold text-gh-text mb-2">
                Postal/Zip code (9-digit zip code for US)
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-lg text-sm text-gh-text focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-gh-text-secondary mt-1">Required for certain countries</p>
            </div>
          </div>

          {/* VAT/GST ID */}
          <div>
            <label htmlFor="vatId" className="block text-sm font-bold text-gh-text mb-2">
              VAT/GST ID
            </label>
            <input
              type="text"
              id="vatId"
              name="vatId"
              value={formData.vatId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-lg text-sm text-gh-text focus:outline-none focus:border-primary"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary hover:brightness-110 text-white rounded-lg text-sm font-bold transition-all"
          >
            Save billing information
          </button>
        </form>
      </section>

      {/* Coupon Section */}
      <section className="bg-gh-bg-secondary border border-gh-border rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gh-text mb-1">Coupon</h2>
            <p className="text-sm text-gh-text-secondary">
              You don't have an active coupon.
            </p>
          </div>
          <button className="px-4 py-2 bg-gh-bg border border-gh-border text-gh-text rounded-lg text-sm font-bold hover:bg-gh-bg-tertiary transition-all">
            Redeem a coupon
          </button>
        </div>
      </section>

      {/* Additional Information Section */}
      <section className="bg-gh-bg-secondary border border-gh-border rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gh-text">Additional information</h2>
            <button className="text-gh-text-secondary hover:text-gh-text">
              <span className="material-symbols-outlined !text-[18px]">info</span>
            </button>
          </div>
          <button className="px-4 py-2 bg-gh-bg border border-gh-border text-gh-text rounded-lg text-sm font-bold hover:bg-gh-bg-tertiary transition-all">
            Add information
          </button>
        </div>
        <p className="text-sm text-gh-text-secondary mt-3">
          No additional information added to your receipts.
        </p>
      </section>
    </div>
  );
};

export default BillingPaymentInfo;

