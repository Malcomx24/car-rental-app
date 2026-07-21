import { User } from "lucide-react";
import type { ReceiptCustomer } from "./receipt-data";
import { ReceiptSectionCard, InfoRow, InfoGrid } from "./receipt-section-card";

interface CustomerInformationProps {
  customer: ReceiptCustomer;
}

export function CustomerInformation({ customer }: CustomerInformationProps) {
  return (
    <ReceiptSectionCard title="Customer Details" subtitle="Primary Driver">
      <div className="flex items-start gap-5">
        {/* Avatar */}
        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center print:bg-gray-100">
          <User className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <InfoGrid>
            <InfoRow label="Full Name" value={customer.fullName} bold />
            <InfoRow label="Email" value={customer.email} />
            <InfoRow label="Phone" value={customer.phone} mono />
            <InfoRow
              label="Driver License"
              value={customer.driverLicense}
              mono
            />
            <InfoRow label="Nationality" value={customer.nationality} />
          </InfoGrid>
        </div>
      </div>
    </ReceiptSectionCard>
  );
}
