import React, { useState } from "react";
import PurchaseModal from "../../components/billing/PurchaseModal";
import styles from "./BillingSettings.module.css";

const UsageMetricCard = ({
  title,
  value,
  total,
  percent,
  icon,
  action,
  color = "bg-primary",
}: any) => (
  <div className="bg-gh-bg-secondary p-5 rounded-xl border border-gh-border flex flex-col">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-slate-500 !text-base">
          {icon}
        </span>
        <span className="text-sm font-bold text-gh-text">{title}</span>
      </div>
      <span className="text-xs font-mono text-slate-400">{percent}%</span>
    </div>
    <p className="text-xs text-slate-500 mb-3">
      {value} of {total}
    </p>
    <div className="h-1.5 bg-gh-bg rounded-full overflow-hidden mb-4">
      <div
        className={`h-full ${color} ${styles.usageProgressBar}`}
        style={{ "--progress-width": `${percent}%` } as React.CSSProperties}
      ></div>
    </div>
    {action && (
      <button className="text-primary text-[11px] font-bold text-left mt-auto hover:underline">
        {action}
      </button>
    )}
  </div>
);

const BillingSettings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const billingHistory = [
    {
      date: "Oct 01, 2023",
      invoice: "#INV-2023-010",
      amount: "$299.00",
      status: "Paid",
      receipt: true,
    },
    {
      date: "Sep 01, 2023",
      invoice: "#INV-2023-009",
      amount: "$299.00",
      status: "Paid",
      receipt: true,
    },
  ];

  return (
    <div className="space-y-12 text-white animate-in fade-in duration-500">
      <header className="flex items-start justify-between pb-6 border-b border-gh-border">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            Billing & Usage
          </h1>
          <p className="text-sm text-gh-text-secondary mt-1">
            Manage your plan, add-ons, and view real-time usage metrics.
          </p>
        </div>
        <button className="px-4 py-2 bg-gh-bg-secondary border border-gh-border text-gh-text rounded-lg text-xs font-bold">
          Contact Support
        </button>
      </header>

      <section className="p-6 bg-gh-bg-secondary border border-gh-border rounded-xl flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-3">
            Enterprise Plan
            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 rounded-full">
              Current
            </span>
          </h3>
          <p className="text-xs text-gh-text-secondary mt-1">
            Your plan renews on{" "}
            <span className="text-white font-bold">Nov 12, 2023</span>.
          </p>
          <p className="text-xs text-gh-text-secondary mt-2">
            <span className="font-bold text-white">Includes:</span> 1 Workspace,
            Community access (read-only), ForgeAI: 10,000 tokens/month
          </p>
        </div>
        <button className="bg-primary hover:brightness-110 text-white px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">
          Manage Subscription
        </button>
      </section>

      <section>
        <h3 className="text-lg font-bold mb-4">Usage Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UsageMetricCard
            title="Storage"
            value="45.2 GB"
            total="100 GB"
            percent={45}
            icon="database"
            color="bg-sky-500"
          />
          <UsageMetricCard
            title="Action Minutes"
            value="1,200"
            total="3,000 mins"
            percent={40}
            icon="timer"
            color="bg-emerald-500"
          />
          <UsageMetricCard
            title="Member Seats"
            value="8"
            total="10"
            percent={80}
            icon="group"
            action="Manage members"
            color="bg-amber-500"
          />
          <UsageMetricCard
            title="Workspaces"
            value="1"
            total="1"
            percent={100}
            icon="view_quilt"
            action="Add workspace"
            color="bg-rose-500"
          />
          <UsageMetricCard
            title="ForgeAI Tokens"
            value="7,800"
            total="10,000"
            percent={78}
            icon="auto_awesome"
            action="Buy more tokens"
            color="bg-purple-500"
          />
        </div>
      </section>

      <section className="p-6 bg-gh-bg-secondary border border-gh-border rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-lg bg-gh-bg flex items-center justify-center text-purple-400 border border-gh-border">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gh-text">
              ForgeAI Assistant
            </h4>
            <p className="text-xs text-gh-text-secondary">
              Enable high-performance developer coding partner.
            </p>
          </div>
        </div>
        <button className="px-4 py-2 bg-gh-bg-tertiary border border-gh-border text-gh-text rounded-lg text-xs font-bold">
          Manage
        </button>
      </section>

      <section>
        <h3 className="text-lg font-bold mb-4">Add-ons & Upgrades</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gh-bg-secondary p-5 rounded-xl border border-gh-border flex flex-col">
            <h4 className="font-bold text-gh-text mb-1">Extra Workspace</h4>
            <p className="text-xs text-gh-text-secondary flex-1 mb-4">
              Add another managed workspace for separate client work.
            </p>
            <div className="flex items-end justify-between">
              <p className="text-lg font-black">
                <span className="text-2xl">$9</span>
                <span className="text-gh-text-secondary">/mo</span>
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-primary text-xs font-bold hover:underline"
              >
                Purchase
              </button>
            </div>
          </div>
          <div className="bg-gh-bg-secondary p-5 rounded-xl border border-gh-border flex flex-col">
            <h4 className="font-bold text-gh-text mb-1">ForgeAI Usage Pack</h4>
            <p className="text-xs text-gh-text-secondary flex-1 mb-4">
              Additional 50,000 AI tokens for heavy usage.
            </p>
            <div className="flex items-end justify-between">
              <p className="text-lg font-black">
                <span className="text-2xl">$15</span>
                <span className="text-gh-text-secondary">/mo</span>
              </p>
              <button className="text-primary text-xs font-bold hover:underline">
                Purchase
              </button>
            </div>
          </div>
          <div className="bg-gh-bg-secondary p-5 rounded-xl border border-gh-border flex flex-col">
            <h4 className="font-bold text-gh-text mb-1">
              Community Visibility
            </h4>
            <p className="text-xs text-gh-text-secondary flex-1 mb-4">
              Publish unlimited public repositories with SEO indexing.
            </p>
            <div className="flex items-end justify-between">
              <p className="text-lg font-black">
                <span className="text-2xl">$5</span>
                <span className="text-gh-text-secondary">/mo</span>
              </p>
              <button className="text-primary text-xs font-bold hover:underline">
                Purchase
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gh-bg-secondary p-5 rounded-xl border border-gh-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gh-text text-sm">Payment Method</h4>
            <button className="text-primary text-xs font-bold hover:underline">
              Edit
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-8 rounded bg-white flex items-center justify-center">
              <svg viewBox="0 0 38 24" className="h-4">
                <path
                  d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                  fill="#00A1E0"
                ></path>
              </svg>
            </div>
            <div>
              <p className="text-xs font-mono">Visa ending in 1234</p>
              <p className="text-xs text-gh-text-secondary">Expires 10/2025</p>
            </div>
          </div>
        </div>
        <div className="bg-gh-bg-secondary p-5 rounded-xl border border-gh-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gh-text text-sm">Billing Address</h4>
            <button className="text-primary text-xs font-bold hover:underline">
              Edit
            </button>
          </div>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-slate-500 mt-0.5 !text-base">
              location_on
            </span>
            <div className="text-xs text-gh-text-secondary">
              <p className="font-bold text-gh-text">TrackCodex Inc.</p>
              <p>123 Developer Way, Suite 400</p>
              <p>San Francisco, CA 94107</p>
              <p>United States</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Billing History</h3>
          <button className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
            Download All{" "}
            <span className="material-symbols-outlined !text-sm">download</span>
          </button>
        </div>
        <div className="bg-gh-bg-secondary border border-gh-border rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gh-bg-header">
              <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Invoice</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gh-border">
              {billingHistory.map((item) => (
                <tr key={item.invoice} className="text-sm text-slate-300">
                  <td className="px-6 py-4">{item.date}</td>
                  <td className="px-6 py-4 font-mono">{item.invoice}</td>
                  <td className="px-6 py-4 font-bold text-gh-text">
                    {item.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-emerald-400 text-xs font-bold">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-slate-500 hover:text-primary">
                      <span className="material-symbols-outlined !text-base">
                        receipt_long
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-4">
          <button className="text-primary text-xs font-bold hover:underline">
            View all invoices
          </button>
        </div>
      </section>

      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default BillingSettings;
