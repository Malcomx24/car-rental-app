import type { BookingStatus, PaymentStatus, PaymentMethod } from "@/types";

// ─── Receipt display types (what the receipt components consume) ─────────────

export interface ReceiptCompany {
  name: string;
  tagline: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  logoUrl?: string;
}

export interface ReceiptInfo {
  receiptNumber: string;
  bookingNumber: string;
  date: string;
  status: BookingStatus;
}

export interface ReceiptCustomer {
  fullName: string;
  email: string;
  phone: string;
  driverLicense: string;
  nationality: string;
}

export interface ReceiptVehicle {
  name: string;
  brand: string;
  year: number;
  fuelType: string;
  transmission: string;
  licensePlate: string;
  color: string;
  seats: number;
  imageUrl?: string;
}

export interface ReceiptRental {
  pickupLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnLocation: string;
  returnDate: string;
  returnTime: string;
  totalDays: number;
}

export interface ReceiptPayment {
  method: PaymentMethod;
  status: PaymentStatus;
  bookingStatus: BookingStatus;
}

export interface ReceiptPriceItem {
  label: string;
  amount: number;
  isDiscount?: boolean;
}

export interface ReceiptBankTransfer {
  bankName: string;
  accountHolder: string;
  iban: string;
  swift: string;
}

export interface ReceiptData {
  company: ReceiptCompany;
  receipt: ReceiptInfo;
  customer: ReceiptCustomer;
  vehicle: ReceiptVehicle;
  rental: ReceiptRental;
  payment: ReceiptPayment;
  priceItems: ReceiptPriceItem[];
  total: number;
  bankTransfer?: ReceiptBankTransfer;
  notes: string[];
}

// ─── API response types (what the backend returns) ───────────────────────────

export interface ApiBookingResponse {
  id: string;
  bookingNumber: string;
  userId: string;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  pricePerDay: number | string;
  subtotal: number | string;
  discountAmount: number | string;
  taxAmount: number | string;
  insuranceAmount: number | string;
  extrasAmount: number | string;
  totalAmount: number | string;
  status: BookingStatus;
  paymentMethod: PaymentMethod | null;
  paymentStatus: PaymentStatus;
  notes: string | null;
  createdAt: string;
  car: {
    name: string;
    year: number;
    fuelType: string;
    transmission: string;
    seats: number;
    color: string;
    licensePlate: string;
    brand: { name: string };
    images: { url: string; isPrimary: boolean }[];
  };
  pickupLocation: { name: string; city: string };
  dropoffLocation: { name: string; city: string };
  extras: { name: string; pricePerDay: number | string; quantity: number }[];
}

export interface ApiUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

export interface ApiBankingDetails {
  bankName: string;
  accountHolder: string;
  iban: string;
  swiftCode: string;
  instructions: string;
}

// ─── Default company info ────────────────────────────────────────────────────

export const DEFAULT_COMPANY: ReceiptCompany = {
  name: "DriveRent Maroc",
  tagline: "Location de Voitures",
  address: "Avenue Hassan II",
  city: "Agadir, Maroc",
  country: "Morocco",
  phone: "+212 661 23 45 67",
  email: "contact@driverent.ma",
  website: "www.driverent.ma",
};

// ─── Default notes ───────────────────────────────────────────────────────────

const DEFAULT_NOTES = [
  "The customer must present a valid driver's license at pickup.",
  "The customer must present a passport or CIN (Carte Nationale d'Identité).",
  "Smoking is strictly prohibited inside the vehicle.",
  "Fuel policy: Return the vehicle with the same fuel level as at pickup.",
  "Late returns will be charged at 150% of the daily rate, prorated hourly.",
  "The security deposit will be refunded within 7 business days after vehicle return.",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toNumber(value: number | string): number {
  return typeof value === "string" ? parseFloat(value) : value;
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

// ─── Mapper: API booking → ReceiptData ───────────────────────────────────────

export function mapBookingToReceipt(
  booking: ApiBookingResponse,
  user: ApiUserProfile | null,
  bankingDetails: ApiBankingDetails | null,
): ReceiptData {
  const pricePerDay = toNumber(booking.pricePerDay);
  const subtotal = toNumber(booking.subtotal);
  const insurance = toNumber(booking.insuranceAmount);
  const discount = toNumber(booking.discountAmount);
  const extras = toNumber(booking.extrasAmount);

  // Build price items
  const priceItems: ReceiptPriceItem[] = [
    {
      label: `Daily Rate (${pricePerDay.toLocaleString("fr-MA")} MAD x ${booking.totalDays} days)`,
      amount: subtotal,
    },
  ];

  if (insurance > 0) {
    priceItems.push({ label: "Insurance", amount: insurance });
  }

  // Add individual extras
  for (const extra of booking.extras) {
    const extraTotal =
      toNumber(extra.pricePerDay) * extra.quantity * booking.totalDays;
    if (extraTotal > 0) {
      priceItems.push({ label: extra.name, amount: extraTotal });
    }
  }

  if (extras > 0 && booking.extras.length === 0) {
    priceItems.push({ label: "Extras", amount: extras });
  }

  if (discount > 0) {
    priceItems.push({ label: "Discount", amount: -discount, isDiscount: true });
  }

  // Customer name
  const fullName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Customer";

  return {
    company: DEFAULT_COMPANY,
    receipt: {
      receiptNumber: `REC-${booking.bookingNumber.replace("BK-", "")}`,
      bookingNumber: booking.bookingNumber,
      date: formatDateShort(booking.createdAt),
      status: booking.status,
    },
    customer: {
      fullName,
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      driverLicense: "—",
      nationality: "Moroccan",
    },
    vehicle: {
      name: booking.car.name,
      brand: booking.car.brand.name,
      year: booking.car.year,
      fuelType: booking.car.fuelType,
      transmission: booking.car.transmission,
      licensePlate: booking.car.licensePlate,
      color: booking.car.color,
      seats: booking.car.seats,
      imageUrl: booking.car.images.find((img) => img.isPrimary)?.url,
    },
    rental: {
      pickupLocation: booking.pickupLocation.name,
      pickupDate: formatDateShort(booking.pickupDate),
      pickupTime: formatTime(booking.pickupDate),
      returnLocation: booking.dropoffLocation.name,
      returnDate: formatDateShort(booking.returnDate),
      returnTime: formatTime(booking.returnDate),
      totalDays: booking.totalDays,
    },
    payment: {
      method: booking.paymentMethod ?? "PAY_AT_PICKUP",
      status: booking.paymentStatus,
      bookingStatus: booking.status,
    },
    priceItems,
    total: toNumber(booking.totalAmount),
    bankTransfer:
      booking.paymentMethod === "BANK_TRANSFER" && bankingDetails
        ? {
            bankName: bankingDetails.bankName,
            accountHolder: bankingDetails.accountHolder,
            iban: bankingDetails.iban,
            swift: bankingDetails.swiftCode,
          }
        : undefined,
    notes: DEFAULT_NOTES,
  };
}
