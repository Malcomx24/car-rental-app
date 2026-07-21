import { ReceiptSectionCard } from "./receipt-section-card";

export function SignatureSection() {
  return (
    <ReceiptSectionCard title="Signatures" subtitle="Authorization">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Signature */}
        <div className="space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
            Customer
          </p>

          <div className="space-y-4">
            {/* Signature Line */}
            <div>
              <div className="border-b border-gray-300 pb-6 print:border-gray-300" />
              <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                Signature
              </p>
            </div>

            {/* Date */}
            <div>
              <div className="border-b border-gray-300 pb-6 print:border-gray-300" />
              <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                Date
              </p>
            </div>
          </div>
        </div>

        {/* Agency Representative */}
        <div className="space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
            Agency Representative
          </p>

          <div className="space-y-4">
            {/* Signature Line */}
            <div>
              <div className="border-b border-gray-300 pb-6 print:border-gray-300" />
              <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
                Signature
              </p>
            </div>

            {/* Stamp */}
            <div>
              <div className="border border-dashed border-gray-300 rounded-lg h-16 flex items-center justify-center print:border-gray-300 print:rounded-lg">
                <p className="text-[10px] text-gray-300 font-medium uppercase tracking-wider">
                  Official Stamp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReceiptSectionCard>
  );
}
