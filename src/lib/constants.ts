export const APP_NAME = "DriveRent";
export const APP_DESCRIPTION = "Premium car rental service — rent luxury vehicles with ease.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Cars", href: "/cars" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const ADMIN_NAV_LINKS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Cars", href: "/admin/cars", icon: "Car" },
  { label: "Bookings", href: "/admin/bookings", icon: "Calendar" },
  { label: "Customers", href: "/admin/customers", icon: "Users" },
  { label: "Payments", href: "/admin/payments", icon: "CreditCard" },
  { label: "Reports", href: "/admin/reports", icon: "BarChart3" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
] as const;

export const DASHBOARD_NAV_LINKS = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "My Bookings", href: "/dashboard/bookings", icon: "Calendar" },
  { label: "Favorites", href: "/dashboard/favorites", icon: "Heart" },
  { label: "Invoices", href: "/dashboard/invoices", icon: "FileText" },
  { label: "Notifications", href: "/dashboard/notifications", icon: "Bell" },
  { label: "Notification Preferences", href: "/dashboard/notifications/preferences", icon: "Settings" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
] as const;

export const CAR_BRANDS = [
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Porsche",
  "Tesla",
  "Lexus",
  "Range Rover",
  "Ferrari",
  "Lamborghini",
  "Maserati",
  "Bentley",
  "Rolls-Royce",
  "Aston Martin",
  "McLaren",
  "Corvette",
] as const;

export const CAR_CATEGORIES = [
  "Economy",
  "Compact",
  "Midsize",
  "Full-size",
  "SUV",
  "Luxury",
  "Sports",
  "Convertible",
  "Minivan",
  "Electric",
  "Premium",
] as const;

export const FUEL_TYPES = [
  "Gasoline",
  "Diesel",
  "Electric",
  "Hybrid",
  "Plug-in Hybrid",
] as const;

export const TRANSMISSION_TYPES = [
  "Automatic",
  "Manual",
  "Semi-Automatic",
] as const;

export const CAR_COLORS = [
  "Black",
  "White",
  "Silver",
  "Gray",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Orange",
  "Brown",
  "Navy",
  "Burgundy",
  "Gold",
  "Purple",
  "Pink",
] as const;

export const SEAT_OPTIONS = [2, 4, 5, 6, 7, 8] as const;

export const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Lowest Price" },
  { value: "price-high", label: "Highest Price" },
  { value: "rating", label: "Highest Rating" },
  { value: "newest", label: "Newest" },
] as const;

export const BOOKING_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
] as const;

export const VEHICLE_STATUSES = [
  "AVAILABLE",
  "RESERVED",
  "RENTED",
  "MAINTENANCE",
  "CLEANING",
  "OUT_OF_SERVICE",
] as const;

export const ROLES = ["CUSTOMER", "EMPLOYEE", "MANAGER", "ADMIN", "SUPER_ADMIN"] as const;

export const ITEMS_PER_PAGE = 12;

export const EXTRAS = [
  {
    id: "gps",
    name: "GPS Navigation",
    description: "Turn-by-turn GPS navigation system",
    pricePerDay: 9.99,
    icon: "MapPin",
  },
  {
    id: "child-seat",
    name: "Child Seat",
    description: "Safety-certified child car seat",
    pricePerDay: 14.99,
    icon: "Baby",
  },
  {
    id: "additional-driver",
    name: "Additional Driver",
    description: "Add a second authorized driver",
    pricePerDay: 12.99,
    icon: "Users",
  },
  {
    id: "insurance-basic",
    name: "Basic Insurance",
    description: "Collision damage waiver with $500 deductible",
    pricePerDay: 19.99,
    icon: "Shield",
  },
  {
    id: "insurance-premium",
    name: "Premium Insurance",
    description: "Zero deductible comprehensive coverage",
    pricePerDay: 34.99,
    icon: "ShieldCheck",
  },
  {
    id: "unlimited-mileage",
    name: "Unlimited Mileage",
    description: "No mileage restrictions on your trip",
    pricePerDay: 14.99,
    icon: "Gauge",
  },
] as const;

export const FOOTER_LINKS = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Press", href: "/press" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Roadside Assistance", href: "/roadside-assistance" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "License Agreement", href: "/license" },
  ],
} as const;
