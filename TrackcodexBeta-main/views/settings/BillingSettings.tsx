import React, { useState } from "react";
import PricingCard from "../../components/billing/PricingCard";

const BillingSettings = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      title: "Free Plan",
      price: "Free",
      features: [
        "Send up to 2 transfers per month",
        "Basic transaction history",
        "Email support",
        "Limited currency support (USD, EUR, GBP)",
        "Basic security features",
      ],
      isPopular: false,
    },
    {
      title: "Standard Plan",
      price: "$9.99",
      period: "/m",
      features: [
        "Unlimited transfers",
        "Transaction history with export options",
        "Priority email support",
        "Expanded currency support",
        "Advanced security features",
      ],
      isPopular: true,
    },
    {
      title: "Business Plan",
      price: "$19.99",
      period: "/m",
      features: [
        "Unlimited transfers with priority processing",
        "Comprehensive transaction analytics",
        "24/7 priority support",
        "Full currency support",
        "Enhanced security features",
      ],
      isPopular: false,
    },
  ];

  return (

    <div className="min-h-screen bg-gh-bg text-gh-text p-8 animate-in fade-in duration-500 overflow-hidden relative font-display">
      {/* Background ambient glow - Refined for "Deep Space" */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full pointer-events-none">
        <div className="absolute top-[10%] left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-75"></div>
        <div className="absolute top-[20%] right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gh-text/5 to-transparent tracking-tighter select-none absolute -top-12 left-1/2 -translate-x-1/2 blur-sm pointer-events-none">
            Pricing
          </h1>
          <h2 className="text-4xl font-bold text-gh-text relative z-10 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gh-text-secondary mt-4 max-w-lg mx-auto">
            Choose the plan that best fits your needs. Upgrade or downgrade at
            any time.
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span
              className={`text-sm font-medium transition-colors ${!isYearly ? "text-gh-text" : "text-gh-text-secondary"
                }`}
            >
              Billed Monthly
            </span>
            <button
              aria-label="Toggle billing frequency"
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-12 h-6 rounded-full bg-gh-bg-secondary border border-gh-border transition-colors focus:outline-none"
            >
              <div
                className={`absolute top-1 left-1 size-4 rounded-full bg-gh-text transition-transform duration-300 shadow-sm ${isYearly ? "translate-x-6" : "translate-x-0"
                  }`}
              />
            </button>
            <span
              className={`text-sm font-medium transition-colors ${isYearly ? "text-gh-text" : "text-gh-text-secondary"
                }`}
            >
              Billed Yearly
            </span>
            <span className="ml-2 text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
              SAVE 20%
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0 w-full items-center">
          {plans.map((plan) => (
            <PricingCard
              key={plan.title}
              {...plan}
              price={
                isYearly && plan.price !== "Free"
                  ? `$${(parseFloat(plan.price.slice(1)) * 12 * 0.8).toFixed(
                    2
                  )}`
                  : plan.price
              }
              period={isYearly ? "/year" : "/m"}
              description={isYearly ? "Billed annually" : "Billed monthly"}
            />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gh-text-secondary text-sm">
            Have a custom requirement?{" "}
            <a href="https://www.quantaforze.com" className="text-gh-text hover:underline underline-offset-4 hover:text-accent transition-colors">
              Contact Sales
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillingSettings;
