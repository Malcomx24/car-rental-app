import type { ReceiptPriceItem } from "./receipt-data";
import { ReceiptSectionCard } from "./receipt-section-card";

interface PriceBreakdownProps {
  priceItems: ReceiptPriceItem[];
  total: number;
}

export function PriceBreakdown({ priceItems, total }: PriceBreakdownProps) {
  return (
    <ReceiptSectionCard title="Price Breakdown" subtitle="Cost Summary">
      <div className="border border-gray-200 rounded-lg overflow-hidden print:border-gray-200 print:rounded-lg">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_auto] gap-4 bg-gray-50 px-4 py-2.5 border-b border-gray-200 print:bg-gray-50 print:border-gray-200">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
            Description
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 text-right">
            Amount
          </span>
        </div>

        {/* Price Rows */}
        <div className="divide-y divide-gray-100 print:divide-gray-100">
          {priceItems.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_auto] gap-4 px-4 py-2.5"
            >
              <span
                className={`text-[13px] ${item.isDiscount ? "text-emerald-600" : "text-gray-600"}`}
              >
                {item.label}
              </span>
              <span
                className={`text-[13px] font-mono text-right ${
                  item.isDiscount
                    ? "text-emerald-600 font-semibold"
                    : "text-gray-800"
                }`}
              >
                {item.amount < 0 ? "-" : ""}
                {Math.abs(Number(item.amount) || 0).toLocaleString("fr-MA")} MAD
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t-2 border-black bg-black text-white px-4 py-3 print:border-black print:bg-black print:text-white">
          <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
            <span className="text-[13px] font-bold uppercase tracking-wider">
              Total
            </span>
            <span className="text-[18px] font-bold font-mono tracking-tight">
              {(Number(total) || 0).toLocaleString("fr-MA")} MAD
            </span>
          </div>
        </div>
      </div>
    </ReceiptSectionCard>
  );
}
