import type { ReactNode } from "react";

interface ReceiptSectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function ReceiptSectionCard({
  title,
  subtitle,
  children,
  className = "",
  noPadding = false,
}: ReceiptSectionCardProps) {
  return (
    <section className={`receipt-section break-inside-avoid ${className}`}>
      <div className="border border-gray-200 rounded-xl overflow-hidden print:border-gray-200 print:rounded-xl">
        {/* Section Header */}
        <div className="border-b border-gray-200 bg-gray-50/60 px-5 py-3 print:bg-gray-50/60 print:border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-0.5 h-5 bg-black rounded-full print:bg-black" />
            <div>
              <h2 className="text-[14px] font-semibold text-black tracking-tight print:text-black">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section Content */}
        <div className={`${noPadding ? "" : "p-5"}`}>{children}</div>
      </div>
    </section>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  mono?: boolean;
  bold?: boolean;
  highlight?: boolean;
  discount?: boolean;
}

export function InfoRow({
  label,
  value,
  mono = false,
  bold = false,
  highlight = false,
  discount = false,
}: InfoRowProps) {
  return (
    <div className="flex items-center justify-between py-2 text-[13px] border-b border-gray-100 last:border-b-0 print:border-gray-100">
      <span className="text-gray-500 font-medium">{label}</span>
      <span
        className={`text-right ${
          mono ? "font-mono" : ""
        } ${bold ? "font-semibold text-black" : "text-gray-800"} ${
          highlight ? "text-black font-semibold text-sm" : ""
        } ${discount ? "text-emerald-600 font-semibold" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

interface InfoGridProps {
  children: ReactNode;
}

export function InfoGrid({ children }: InfoGridProps) {
  return (
    <div className="divide-y divide-gray-100 print:divide-gray-100">
      {children}
    </div>
  );
}
