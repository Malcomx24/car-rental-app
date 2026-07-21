import { CreditCard, Banknote, CheckCircle2 } from "lucide-react";
import type { ReceiptPayment } from "./receipt-data";
import { ReceiptSectionCard } from "./receipt-section-card";

interface PaymentInformationProps {
  payment: ReceiptPayment;
}

const METHOD_CONFIG = {
  PAY_AT_PICKUP: {
    label: "Pay at Pickup",
    icon: Banknote,
  },
  BANK_TRANSFER: {
    label: "Bank Transfer",
    icon: CreditCard,
  },
} as const;

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; style: string }> =
  {
    PENDING: {
      label: "Pending",
      style: "bg-amber-50 text-amber-700 ring-amber-600/20",
    },
    AWAITING_TRANSFER: {
      label: "Awaiting Transfer",
      style: "bg-amber-50 text-amber-700 ring-amber-600/20",
    },
    SUCCEEDED: {
      label: "Paid",
      style: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    },
    FAILED: {
      label: "Failed",
      style: "bg-red-50 text-red-700 ring-red-600/20",
    },
    REFUNDED: {
      label: "Refunded",
      style: "bg-gray-50 text-gray-700 ring-gray-600/20",
    },
  };

const BOOKING_STATUS_CONFIG: Record<string, { label: string; style: string }> =
  {
    CONFIRMED: {
      label: "Confirmed",
      style: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    },
    PENDING: {
      label: "Pending",
      style: "bg-amber-50 text-amber-700 ring-amber-600/20",
    },
    ACTIVE: {
      label: "Active",
      style: "bg-blue-50 text-blue-700 ring-blue-600/20",
    },
    COMPLETED: {
      label: "Completed",
      style: "bg-gray-50 text-gray-700 ring-gray-600/20",
    },
    CANCELLED: {
      label: "Cancelled",
      style: "bg-red-50 text-red-700 ring-red-600/20",
    },
  };

export function PaymentInformation({ payment }: PaymentInformationProps) {
  const methodConfig =
    METHOD_CONFIG[payment.method] || METHOD_CONFIG.PAY_AT_PICKUP;
  const MethodIcon = methodConfig.icon;
  const paymentStatus =
    PAYMENT_STATUS_CONFIG[payment.status] || PAYMENT_STATUS_CONFIG.PENDING;
  const bookingStatus =
    BOOKING_STATUS_CONFIG[payment.bookingStatus] ||
    BOOKING_STATUS_CONFIG.PENDING;

  return (
    <ReceiptSectionCard
      title="Payment Details"
      subtitle="Transaction Information"
    >
      <div className="space-y-4">
        {/* Payment Method */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">
            Payment Method
          </p>
          <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200 print:bg-gray-50 print:border-gray-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <MethodIcon className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
            <span className="text-[13px] font-medium text-gray-700">
              {methodConfig.label}
            </span>
          </div>
        </div>

        {/* Status Badges */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1.5">
              Payment Status
            </p>
            <span
              className={`inline-flex items-center rounded-md px-2.5 py-1 text-[12px] font-semibold ring-1 ring-inset ${paymentStatus.style}`}
            >
              {paymentStatus.label}
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1.5">
              Booking Status
            </p>
            <span
              className={`inline-flex items-center rounded-md px-2.5 py-1 text-[12px] font-semibold ring-1 ring-inset ${bookingStatus.style}`}
            >
              {bookingStatus.label}
            </span>
          </div>
        </div>
      </div>
    </ReceiptSectionCard>
  );
}
