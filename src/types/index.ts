export type UserRole = "CUSTOMER" | "EMPLOYEE" | "MANAGER" | "ADMIN" | "SUPER_ADMIN";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "AWAITING_TRANSFER" | "SUCCEEDED" | "FAILED" | "REFUNDED";
export type PaymentMethod = "PAY_AT_PICKUP" | "BANK_TRANSFER";

export type VehicleStatus =
  | "AVAILABLE"
  | "RESERVED"
  | "RENTED"
  | "MAINTENANCE"
  | "CLEANING"
  | "OUT_OF_SERVICE";

export type FuelType = "Gasoline" | "Diesel" | "Electric" | "Hybrid" | "Plug-in Hybrid";

export type TransmissionType = "Automatic" | "Manual" | "Semi-Automatic";

export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  category: string;
  year: number;
  pricePerDay: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  seats: number;
  color: string;
  mileage: number;
  licensePlate: string;
  description: string;
  features: string[];
  status: VehicleStatus;
  images: CarImage[];
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CarImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  car?: Car;
  user?: User;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  pricePerDay: number;
  extras: BookingExtra[];
  subtotal: number;
  taxes: number;
  insurance: number;
  total: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingExtra {
  id: string;
  name: string;
  pricePerDay: number;
  quantity: number;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  stripePaymentIntentId?: string;
  description?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  carId: string;
  user?: User;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  latitude: number;
  longitude: number;
  operatingHours: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  isRead: boolean;
  createdAt: string;
}

export interface Invoice {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  tax: number;
  total: number;
  status: "PAID" | "PENDING" | "OVERDUE";
  dueDate: string;
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  totalCars: number;
  totalCustomers: number;
  revenueChange: number;
  bookingsChange: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchFilters {
  brand?: string;
  category?: string;
  fuelType?: string;
  transmission?: string;
  seats?: number;
  minPrice?: number;
  maxPrice?: number;
  year?: number;
  color?: string;
  availability?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}
