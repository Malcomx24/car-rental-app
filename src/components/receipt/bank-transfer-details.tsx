import { Building2 } from "lucide-react";
import type { ReceiptBankTransfer } from "./receipt-data";
import { ReceiptSectionCard, InfoRow, InfoGrid } from "./receipt-section-card";

interface BankTransferDetailsProps {
  bankTransfer: ReceiptBankTransfer;
  bookingNumber: string;
}

export function BankTransferDetails({
  bankTransfer,
  bookingNumber,
}: BankTransferDetailsProps) {
  return (
    <ReceiptSectionCard title="Bank Transfer" subtitle="Payment Instructions">
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200/60 rounded-lg print:bg-amber-50 print:border-amber-200/60">
          <Building2 className="w-4 h-4 text-amber-600" />
          <p className="text-[12px] text-amber-700 font-medium">
            Please use the reference below when making the transfer.
          </p>
        </div>

        <InfoGrid>
          <InfoRow label="Bank Name" value={bankTransfer.bankName} bold />
          <InfoRow label="Account Holder" value={bankTransfer.accountHolder} />
          <InfoRow label="IBAN" value={bankTransfer.iban} mono />
          <InfoRow label="SWIFT / BIC" value={bankTransfer.swift} mono />
          <InfoRow label="Reference" value={bookingNumber} mono bold />
        </InfoGrid>
      </div>
    </ReceiptSectionCard>
  );
}
