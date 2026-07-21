import { Car, Fuel, Settings2, Palette, Hash, Users } from "lucide-react";
import type { ReceiptVehicle } from "./receipt-data";
import { ReceiptSectionCard, InfoRow, InfoGrid } from "./receipt-section-card";

interface VehicleInformationProps {
  vehicle: ReceiptVehicle;
}

export function VehicleInformation({ vehicle }: VehicleInformationProps) {
  return (
    <ReceiptSectionCard title="Vehicle Details" subtitle="Reserved Vehicle">
      <div className="flex items-start gap-5">
        {/* Vehicle Image Placeholder */}
        <div className="flex-shrink-0 w-[120px] h-[80px] bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200/60 overflow-hidden print:bg-gray-100 print:border-gray-200">
          <div className="flex flex-col items-center gap-1.5 text-gray-300">
            <Car className="w-8 h-8" strokeWidth={1} />
            <span className="text-[9px] font-medium uppercase tracking-wider">
              {vehicle.year} {vehicle.brand}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold text-black mb-2 print:text-black">
            {vehicle.name} {vehicle.year}
          </h3>
          <InfoGrid>
            <InfoRow label="Transmission" value={`${vehicle.transmission}`} />
            <InfoRow label="Fuel Type" value={vehicle.fuelType} />
            <InfoRow
              label="License Plate"
              value={vehicle.licensePlate}
              mono
              bold
            />
            <InfoRow label="Color" value={vehicle.color} />
            <InfoRow label="Seats" value={`${vehicle.seats}`} />
          </InfoGrid>
        </div>
      </div>
    </ReceiptSectionCard>
  );
}
