import React from "react";

interface PricingCardProps {
    title: string;
    price: string;
    period?: string;
    description?: string;
    features: string[];
    isPopular?: boolean;
    buttonText?: string;
    onSelect?: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
    title,
    price,
    period = "/month",
    description,
    features,
    isPopular = false,
    buttonText = "Get Started",
    onSelect,
}) => {
    return (
        <div
            className={`relative p-8 rounded-3xl border flex flex-col h-full transition-all duration-300 ${isPopular
                ? "bg-gh-bg-tertiary border-accent/20 shadow-glass shadow-accent/10 backdrop-blur-xl scale-105 z-10"
                : "bg-gh-bg-secondary border-gh-border hover:bg-gh-bg-tertiary/50 hover:border-gh-border/80 backdrop-blur-lg"
                }`}
        >
            {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full shadow-lg">
                    Most Popular
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-lg font-medium text-gh-text mb-2">{title}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gh-text tracking-tight">
                        {price}
                    </span>
                    {price !== "Free" && (
                        <span className="text-sm text-gh-text-secondary font-medium">{period}</span>
                    )}
                </div>
                {description && (
                    <p className="text-sm text-gh-text-secondary mt-2">{description}</p>
                )}
            </div>

            <div className="flex-1 mb-8">
                <ul className="space-y-4">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <div
                                className={`flex-shrink-0 size-5 rounded-full flex items-center justify-center ${isPopular ? "bg-accent/20 text-accent" : "bg-gh-border text-gh-text-secondary"
                                    }`}
                            >
                                <span className="material-symbols-outlined !text-[14px] font-bold">
                                    check
                                </span>
                            </div>
                            <span className="text-sm text-gh-text-secondary leading-tight">
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <button
                onClick={onSelect}
                className={`w-full py-3 rounded-full text-sm font-bold transition-all duration-300 ${isPopular
                    ? "bg-gh-text text-gh-bg hover:bg-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
                    : "bg-transparent text-gh-text border border-gh-border hover:bg-gh-border hover:border-gh-text-secondary/50"
                    }`}
            >
                {buttonText}
            </button>

            {/* Glossy overlay effect */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-b from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
        </div>
    );
};

export default PricingCard;
