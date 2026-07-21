import {
  Car,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import type { ReceiptCompany, ReceiptInfo } from "./receipt-data";

interface ReceiptHeaderProps {
  company: ReceiptCompany;
  receipt: ReceiptInfo;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
  CONFIRMED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  ACTIVE: "bg-blue-50 text-blue-700 ring-blue-600/20",
  COMPLETED: "bg-gray-50 text-gray-700 ring-gray-600/20",
  CANCELLED: "bg-red-50 text-red-700 ring-red-600/20",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function ReceiptHeader({ company, receipt }: ReceiptHeaderProps) {
  const statusStyle = STATUS_STYLES[receipt.status] || STATUS_STYLES.CONFIRMED;
  const statusLabel = STATUS_LABELS[receipt.status] || receipt.status;

  return (
    <header className="receipt-header">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Company Logo & Info */}
        <div className="flex items-start gap-4">
          {/* Logo Mark */}
          <div className="flex-shrink-0 w-14 h-14 bg-black rounded-xl flex items-center justify-center print:bg-black print:rounded-xl">
            <Car className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>
          {/* Company Details */}
          <div className="space-y-0.5">
            <h1 className="text-xl font-semibold tracking-tight text-black print:text-black">
              {company.name}
            </h1>
            <p className="text-[13px] text-gray-500 font-medium tracking-wide uppercase">
              {company.tagline}
            </p>
            <div className="flex flex-col gap-0.5 pt-1.5">
              <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                <MapPin className="w-3 h-3" strokeWidth={2} />
                <span>{company.city}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                <Phone className="w-3 h-3" strokeWidth={2} />
                <span>{company.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                <Mail className="w-3 h-3" strokeWidth={2} />
                <span>{company.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                <Globe className="w-3 h-3" strokeWidth={2} />
                <span>{company.website}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt Info */}
        <div className="text-left md:text-right space-y-2">
          <div className="flex items-center gap-2 md:justify-end">
            <FileText className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
            <span className="text-[15px] font-semibold tracking-wide text-black uppercase print:text-black">
              Booking Receipt
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 md:justify-end text-[13px]">
              <span className="text-gray-400 font-medium">Receipt #</span>
              <span className="font-mono font-semibold text-black">
                {receipt.receiptNumber}
              </span>
            </div>
            <div className="flex items-center gap-3 md:justify-end text-[13px]">
              <span className="text-gray-400 font-medium">Booking #</span>
              <span className="font-mono font-semibold text-black">
                {receipt.bookingNumber}
              </span>
            </div>
            <div className="flex items-center gap-3 md:justify-end text-[13px]">
              <span className="text-gray-400 font-medium">Date</span>
              <span className="font-mono text-black">{receipt.date}</span>
            </div>
            <div className="flex items-center gap-3 md:justify-end text-[13px]">
              <span className="text-gray-400 font-medium">Status</span>
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusStyle}`}
              >
                {statusLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-6 border-t border-gray-200 print:border-gray-200" />
    </header>
  );
}
