import { CreditCard, Receipt, Zap } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto p-8 md:p-12 scrollbar-hide">
      <div className="mx-auto w-full max-w-4xl space-y-12">
        
        {/* Header */}
        <div>
          <h1 className="font-sans text-[clamp(28px,5vw,40px)] font-semibold tracking-tight text-[var(--ink)]">Billing & Plans</h1>
          <p className="mt-3 font-sans text-[16px] leading-relaxed text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]">
            Manage your subscription and payment methods.
          </p>
        </div>

        {/* Current Plan */}
        <div className="rounded-[2rem] bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-sans text-[24px] font-semibold tracking-tight text-[var(--ink)]">Studio Pro</h2>
                <span className="rounded-full bg-[var(--ink)] px-3 py-1 font-sans text-[12px] font-medium text-[var(--bg)]">
                  Active
                </span>
              </div>
              <p className="mt-2 font-sans text-[14px] text-[color:color-mix(in_srgb,var(--ink)_60%,transparent)]">
                Next billing date: October 1, 2026
              </p>
            </div>
            <div className="text-left md:text-right">
              <div className="font-sans text-[32px] font-semibold tracking-tight text-[var(--ink)]">$49<span className="font-sans text-[18px] font-medium text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]">/mo</span></div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-full bg-[var(--ink)] px-6 py-3 font-sans text-[14px] font-medium text-[var(--bg)] transition-transform hover:scale-105 active:scale-95">
              Manage Subscription
            </button>
            <button className="rounded-full bg-[color:color-mix(in_srgb,var(--ink)_8%,transparent)] px-6 py-3 font-sans text-[14px] font-medium text-[var(--ink)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--ink)_12%,transparent)]">
              Cancel Plan
            </button>
          </div>
        </div>

        {/* Payment Method & History Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          
          {/* Payment Method */}
          <div className="rounded-[2rem] bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] p-8">
            <div className="mb-6 flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-[var(--ink)]" />
              <h3 className="font-sans text-[20px] font-semibold tracking-tight text-[var(--ink)]">Payment Method</h3>
            </div>
            
            <div className="flex items-center justify-between rounded-2xl bg-[color:color-mix(in_srgb,var(--ink)_4%,transparent)] p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-14 items-center justify-center rounded-md bg-[var(--ink)] text-[var(--bg)]">
                  <span className="font-sans text-xs font-bold">VISA</span>
                </div>
                <div>
                  <p className="font-sans text-[14px] font-medium text-[var(--ink)]">•••• 4242</p>
                  <p className="font-sans text-[12px] text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]">Expires 12/28</p>
                </div>
              </div>
              <button className="font-sans text-[13px] font-medium text-[var(--ink)] underline-offset-4 hover:underline">
                Edit
              </button>
            </div>
            
            <button className="mt-6 font-sans text-[14px] font-medium text-[var(--ink)] underline-offset-4 hover:underline">
              + Add payment method
            </button>
          </div>

          {/* Billing History */}
          <div className="rounded-[2rem] bg-[color:color-mix(in_srgb,var(--ink)_3%,transparent)] p-8">
            <div className="mb-6 flex items-center gap-3">
              <Receipt className="h-5 w-5 text-[var(--ink)]" />
              <h3 className="font-sans text-[20px] font-semibold tracking-tight text-[var(--ink)]">Billing History</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { date: "Sep 1, 2026", amount: "$49.00", status: "Paid" },
                { date: "Aug 1, 2026", amount: "$49.00", status: "Paid" },
                { date: "Jul 1, 2026", amount: "$49.00", status: "Paid" },
              ].map((invoice, i) => (
                <div key={i} className="flex items-center justify-between border-b border-[color:color-mix(in_srgb,var(--ink)_10%,transparent)] pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-sans text-[14px] font-medium text-[var(--ink)]">{invoice.date}</p>
                    <p className="font-sans text-[12px] text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)]">Studio Pro</p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-[14px] font-medium text-[var(--ink)]">{invoice.amount}</p>
                    <button className="font-sans text-[12px] text-[color:color-mix(in_srgb,var(--ink)_50%,transparent)] hover:text-[var(--ink)]">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
