import type { ReceiptData } from "./receipt-data";
import { ReceiptHeader } from "./receipt-header";
import { CustomerInformation } from "./customer-information";
import { VehicleInformation } from "./vehicle-information";
import { RentalInformation } from "./rental-information";
import { PaymentInformation } from "./payment-information";
import { PriceBreakdown } from "./price-breakdown";
import { BankTransferDetails } from "./bank-transfer-details";
import { ImportantNotes } from "./important-notes";
import { SignatureSection } from "./signature-section";
import { ReceiptQRCode } from "./receipt-qr-code";
import { ReceiptFooter } from "./receipt-footer";
import { ReceiptActions } from "./receipt-actions";

interface BookingReceiptProps {
  data: ReceiptData;
}

export function BookingReceipt({ data }: BookingReceiptProps) {
  return (
    <>
      <ReceiptActions />

      {/* A4 Receipt Container */}
      <div className="receipt-container mx-auto bg-white print:bg-white">
        {/* Header */}
        <ReceiptHeader company={data.company} receipt={data.receipt} />

        {/* Customer + Vehicle (2-col on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <CustomerInformation customer={data.customer} />
          <VehicleInformation vehicle={data.vehicle} />
        </div>

        {/* Rental Information */}
        <div className="mt-5">
          <RentalInformation rental={data.rental} />
        </div>

        {/* Payment + Price (2-col on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <PaymentInformation payment={data.payment} />
          <PriceBreakdown priceItems={data.priceItems} total={data.total} />
        </div>

        {/* Bank Transfer (conditional) */}
        {data.bankTransfer && (
          <div className="mt-5">
            <BankTransferDetails
              bankTransfer={data.bankTransfer}
              bookingNumber={data.receipt.bookingNumber}
            />
          </div>
        )}

        {/* Important Notes */}
        <div className="mt-5">
          <ImportantNotes notes={data.notes} />
        </div>

        {/* Signature + QR Code Row */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 mt-5 items-start">
          <SignatureSection />
          <div className="flex md:justify-end md:pt-5">
            <ReceiptQRCode
              bookingNumber={data.receipt.bookingNumber}
              customerName={data.customer.fullName}
              vehicle={`${data.vehicle.year} ${data.vehicle.name}`}
              pickupDate={data.rental.pickupDate}
              returnDate={data.rental.returnDate}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6">
          <ReceiptFooter company={data.company} />
        </div>
      </div>
    </>
  );
}
