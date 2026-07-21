import { MapPin, Clock, ArrowRight, CalendarDays } from "lucide-react";
import type { ReceiptRental } from "./receipt-data";
import { ReceiptSectionCard } from "./receipt-section-card";

interface RentalInformationProps {
  rental: ReceiptRental;
}

export function RentalInformation({ rental }: RentalInformationProps) {
  return (
    <ReceiptSectionCard title="Rental Details" subtitle="Trip Information">
      <div className="space-y-4">
        {/* Pick-up & Return Timeline */}
        <div className="flex flex-col gap-0">
          {/* Pick-up */}
          <div className="flex items-start gap-4 relative">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center print:bg-black">
                <MapPin className="w-3.5 h-3.5 text-white" strokeWidth={2} />
              </div>
              <div className="w-px h-full bg-gray-200 mt-1 print:bg-gray-200" />
            </div>
            <div className="flex-1 pb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1">
                Pick-up
              </p>
              <p className="text-[14px] font-semibold text-black print:text-black">
                {rental.pickupLocation}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1 text-[12px] text-gray-500">
                  <CalendarDays className="w-3 h-3" />
                  {rental.pickupDate}
                </span>
                <span className="flex items-center gap-1 text-[12px] text-gray-500">
                  <Clock className="w-3 h-3" />
                  {rental.pickupTime}
                </span>
              </div>
            </div>
          </div>

          {/* Return */}
          <div className="flex items-start gap-4 relative">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center print:bg-gray-800">
                <MapPin className="w-3.5 h-3.5 text-white" strokeWidth={2} />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1">
                Return
              </p>
              <p className="text-[14px] font-semibold text-black print:text-black">
                {rental.returnLocation}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1 text-[12px] text-gray-500">
                  <CalendarDays className="w-3 h-3" />
                  {rental.returnDate}
                </span>
                <span className="flex items-center gap-1 text-[12px] text-gray-500">
                  <Clock className="w-3 h-3" />
                  {rental.returnTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Duration Badge */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 print:border-gray-100">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg print:bg-gray-100">
            <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[12px] font-semibold text-gray-700">
              {rental.totalDays} Days
            </span>
          </div>
        </div>
      </div>
    </ReceiptSectionCard>
  );
}
