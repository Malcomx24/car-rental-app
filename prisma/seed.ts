import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...\n");

  // ── Roles ────────────────────────────────
  const roles = await Promise.all(
    ["CUSTOMER", "EMPLOYEE", "MANAGER", "ADMIN", "SUPER_ADMIN"].map((name) =>
      prisma.role.upsert({
        where: { name },
        update: {},
        create: { name, description: `${name} role` },
      })
    )
  );
  console.log(`✓ ${roles.length} roles created`);

  // ── Permissions ──────────────────────────
  const permissions = [
    { resource: "cars", action: "read" },
    { resource: "cars", action: "write" },
    { resource: "cars", action: "delete" },
    { resource: "bookings", action: "read" },
    { resource: "bookings", action: "write" },
    { resource: "bookings", action: "approve" },
    { resource: "users", action: "read" },
    { resource: "users", action: "write" },
    { resource: "payments", action: "read" },
    { resource: "payments", action: "refund" },
    { resource: "reports", action: "read" },
    { resource: "settings", action: "write" },
  ];

  const adminRole = roles.find((r) => r.name === "ADMIN")!;
  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: `${perm.resource}:${perm.action}` },
      update: {},
      create: {
        name: `${perm.resource}:${perm.action}`,
        resource: perm.resource,
        action: perm.action,
        roleId: adminRole.id,
      },
    });
  }
  console.log(`✓ ${permissions.length} permissions created`);

  // ── Brands ───────────────────────────────
  const brandData = [
    { name: "Toyota", country: "Japan" },
    { name: "BMW", country: "Germany" },
    { name: "Mercedes-Benz", country: "Germany" },
    { name: "Audi", country: "Germany" },
    { name: "Volkswagen", country: "Germany" },
    { name: "Renault", country: "France" },
    { name: "Peugeot", country: "France" },
    { name: "Dacia", country: "Romania" },
    { name: "Hyundai", country: "South Korea" },
    { name: "Kia", country: "South Korea" },
    { name: "Nissan", country: "Japan" },
    { name: "Honda", country: "Japan" },
    { name: "Ford", country: "USA" },
    { name: "Chevrolet", country: "USA" },
    { name: "Fiat", country: "Italy" },
    { name: "Skoda", country: "Czech Republic" },
    { name: "Seat", country: "Spain" },
    { name: "Volvo", country: "Sweden" },
    { name: "Lexus", country: "Japan" },
    { name: "Porsche", country: "Germany" },
    { name: "Land Rover", country: "UK" },
    { name: "Jeep", country: "USA" },
    { name: "Mini", country: "UK" },
    { name: "Suzuki", country: "Japan" },
    { name: "Mitsubishi", country: "Japan" },
  ];

  const brands: Record<string, string> = {};
  for (const b of brandData) {
    const brand = await prisma.brand.upsert({
      where: { name: b.name },
      update: {},
      create: b,
    });
    brands[b.name] = brand.id;
  }
  console.log(`✓ ${Object.keys(brands).length} brands created`);

  // ── Categories ───────────────────────────
  const categoryData = [
    { name: "Economy", description: "Fuel-efficient and budget-friendly vehicles", icon: "DollarSign" },
    { name: "Compact", description: "Easy to drive and park in the city", icon: "Car" },
    { name: "Midsize", description: "Comfortable for daily commuting", icon: "Car" },
    { name: "Full-size", description: "Spacious sedans for business travel", icon: "CarFront" },
    { name: "SUV", description: "Versatile vehicles for all terrains", icon: "Truck" },
    { name: "Luxury", description: "Premium vehicles with top-tier features", icon: "Crown" },
    { name: "Sports", description: "High-performance sports cars", icon: "Zap" },
    { name: "Convertible", description: "Open-air driving experience", icon: "Sun" },
    { name: "Minivan", description: "Family-friendly with ample seating", icon: "Users" },
    { name: "Electric", description: "Zero-emission electric vehicles", icon: "Battery" },
    { name: "Premium", description: "High-end executive vehicles", icon: "Star" },
  ];

  const categories: Record<string, string> = {};
  for (const c of categoryData) {
    const category = await prisma.category.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    });
    categories[c.name] = category.id;
  }
  console.log(`✓ ${Object.keys(categories).length} categories created`);

  // ── Locations ────────────────────────────
  const locationData = [
    {
      name: "Downtown Manhattan",
      slug: "downtown-manhattan",
      address: "350 5th Avenue",
      city: "New York",
      state: "NY",
      country: "US",
      zipCode: "10118",
      phone: "+1 (212) 555-0101",
      email: "manhattan@driverent.com",
      latitude: 40.7484,
      longitude: -73.9857,
      isAirport: false,
    },
    {
      name: "JFK International Airport",
      slug: "jfk-airport",
      address: "Building 14",
      city: "Queens",
      state: "NY",
      country: "US",
      zipCode: "11430",
      phone: "+1 (718) 555-0102",
      email: "jfk@driverent.com",
      latitude: 40.6413,
      longitude: -73.7781,
      isAirport: true,
    },
    {
      name: "Miami Beach",
      slug: "miami-beach",
      address: "1100 Lincoln Road",
      city: "Miami Beach",
      state: "FL",
      country: "US",
      zipCode: "33139",
      phone: "+1 (305) 555-0103",
      email: "miami@driverent.com",
      latitude: 25.7907,
      longitude: -80.1300,
      isAirport: false,
    },
    {
      name: "Los Angeles International Airport",
      slug: "lax-airport",
      address: "9601 World Way",
      city: "Los Angeles",
      state: "CA",
      country: "US",
      zipCode: "90045",
      phone: "+1 (310) 555-0104",
      email: "lax@driverent.com",
      latitude: 33.9425,
      longitude: -118.4081,
      isAirport: true,
    },
    {
      name: "Chicago O'Hare",
      slug: "chicago-ohare",
      address: "10000 W O'Hare Ave",
      city: "Chicago",
      state: "IL",
      country: "US",
      zipCode: "60666",
      phone: "+1 (312) 555-0105",
      email: "chicago@driverent.com",
      latitude: 41.9742,
      longitude: -87.9073,
      isAirport: true,
    },
    {
      name: "Las Vegas Strip",
      slug: "las-vegas-strip",
      address: "3600 Las Vegas Blvd S",
      city: "Las Vegas",
      state: "NV",
      country: "US",
      zipCode: "89109",
      phone: "+1 (702) 555-0106",
      email: "vegas@driverent.com",
      latitude: 36.1147,
      longitude: -115.1728,
      isAirport: false,
    },
  ];

  const locationIds: string[] = [];
  for (const l of locationData) {
    const { id } = await prisma.location.upsert({
      where: { slug: l.slug },
      update: {},
      create: l,
    });
    locationIds.push(id);
  }
  console.log(`✓ ${locationIds.length} locations created`);

  // ── Cars ─────────────────────────────────
  const carData = [
    {
      name: "3 Series",
      slug: "bmw-3-series",
      brand: "BMW",
      category: "Midsize",
      year: 2024,
      pricePerDay: 89,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      seats: 5,
      color: "Black",
      mileage: 12400,
      licensePlate: "NYC-3S-2024",
      description: "The BMW 3 Series delivers an exhilarating driving experience with its powerful turbocharged engine and precision handling. Perfect for business travel and weekend getaways.",
      features: ["Leather Seats", "Sunroof", "Navigation", "Bluetooth", "Backup Camera", "Heated Seats"],
      isFeatured: true,
      engineSize: "2.0L Turbo",
      horsepower: 255,
      fuelCapacity: 15.9,
    },
    {
      name: "C-Class",
      slug: "mercedes-c-class",
      brand: "Mercedes-Benz",
      category: "Midsize",
      year: 2024,
      pricePerDay: 95,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      seats: 5,
      color: "White",
      mileage: 8900,
      licensePlate: "NYC-MC-2024",
      description: "The Mercedes-Benz C-Class combines luxury with performance. Its refined interior and advanced technology make every journey first-class.",
      features: ["Leather Seats", "Panoramic Roof", "MBUX System", "Ambient Lighting", "Wireless Charging", "360 Camera"],
      isFeatured: true,
      engineSize: "2.0L Turbo",
      horsepower: 255,
      fuelCapacity: 17.4,
    },
    {
      name: "A4",
      slug: "audi-a4",
      brand: "Audi",
      category: "Midsize",
      year: 2024,
      pricePerDay: 85,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      seats: 5,
      color: "Gray",
      mileage: 15200,
      licensePlate: "NYC-A4-2024",
      description: "The Audi A4 offers a perfect blend of sportiness and luxury with Quattro all-wheel drive and a refined cockpit.",
      features: ["Leather Seats", "Virtual Cockpit", "MMI Navigation", "Apple CarPlay", "LED Headlights", "Audi Drive Select"],
      engineSize: "2.0L Turbo",
      horsepower: 261,
      fuelCapacity: 15.3,
    },
    {
      name: "Model S",
      slug: "tesla-model-s",
      brand: "Tesla",
      category: "Electric",
      year: 2024,
      pricePerDay: 149,
      fuelType: "ELECTRIC" as const,
      transmission: "AUTOMATIC" as const,
      seats: 5,
      color: "White",
      mileage: 5600,
      licensePlate: "NYC-TS-2024",
      description: "The Tesla Model S is the ultimate electric sedan with blistering acceleration, cutting-edge technology, and over 400 miles of range.",
      features: ["Autopilot", "17\" Touchscreen", "Premium Audio", "Glass Roof", "HEPA Filter", "Wireless Charging", "Over-the-Air Updates"],
      isFeatured: true,
      horsepower: 670,
      fuelCapacity: 0,
    },
    {
      name: "911 Carrera",
      slug: "porsche-911-carrera",
      brand: "Porsche",
      category: "Sports",
      year: 2024,
      pricePerDay: 299,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      seats: 4,
      color: "Red",
      mileage: 3200,
      licensePlate: "NYC-P911-24",
      description: "The Porsche 911 Carrera is an icon of automotive engineering. Feel the thrill of rear-engine dynamics and precision German engineering.",
      features: ["Sport Chrono", "PASM Suspension", "Bose Audio", "Sport Exhaust", "Lane Assist", "ParkAssist"],
      isFeatured: true,
      engineSize: "3.0L Twin-Turbo Flat-6",
      horsepower: 379,
      fuelCapacity: 16.3,
    },
    {
      name: "Range Rover Sport",
      slug: "range-rover-sport",
      brand: "Range Rover",
      category: "SUV",
      year: 2024,
      pricePerDay: 189,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      seats: 5,
      color: "Navy",
      mileage: 9800,
      licensePlate: "NYC-RR-2024",
      description: "The Range Rover Sport delivers unrivaled luxury in an SUV package. Command the road with confidence and sophistication.",
      features: ["Meridian Audio", "Air Suspension", "Terrain Response", "Head-Up Display", "Matrix LED", "Wi-Fi Hotspot"],
      isFeatured: true,
      engineSize: "3.0L Turbo Inline-6",
      horsepower: 395,
      fuelCapacity: 23.8,
    },
    {
      name: "LX 600",
      slug: "lexus-lx600",
      brand: "Lexus",
      category: "SUV",
      year: 2024,
      pricePerDay: 169,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      seats: 7,
      color: "Black",
      mileage: 11300,
      licensePlate: "NYC-LX-2024",
      description: "The Lexus LX 600 is the pinnacle of luxury SUVs. Combining off-road capability with unparalleled comfort and reliability.",
      features: ["Mark Levinson Audio", "Multi-Terrain Select", "Crawl Control", "12.3\" Display", "Rear Entertainment", "Cooling Seats"],
      engineSize: "3.5L Twin-Turbo V6",
      horsepower: 409,
      fuelCapacity: 22.5,
    },
    {
      name: "F8 Tributo",
      slug: "ferrari-f8-tributo",
      brand: "Ferrari",
      category: "Sports",
      year: 2023,
      pricePerDay: 599,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      seats: 2,
      color: "Red",
      mileage: 2100,
      licensePlate: "NYC-F8-2024",
      description: "The Ferrari F8 Tributo is a masterpiece of Italian engineering. A mid-engine V8 supercar that delivers pure adrenaline.",
      features: ["Carbon Fiber Interior", "Racing Seats", "Launch Control", "Carbon Ceramic Brakes", "Apple CarPlay", "Track Mode"],
      isFeatured: true,
      engineSize: "3.9L Twin-Turbo V8",
      horsepower: 710,
      fuelCapacity: 20.3,
    },
    {
      name: "Huracán EVO",
      slug: "lamborghini-huracan",
      brand: "Lamborghini",
      category: "Sports",
      year: 2023,
      pricePerDay: 549,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      seats: 2,
      color: "Yellow",
      mileage: 3500,
      licensePlate: "NYC-LH-2024",
      description: "The Lamborghini Huracán EVO is a sculptural masterpiece with a naturally aspirated V10 that roars with 630 horsepower.",
      features: ["LDVI System", "Carbon Ceramic Brakes", "Magnetic Suspension", "Performance Traction Control", "Infotainment with Apple CarPlay"],
      engineSize: "5.2L V10",
      horsepower: 630,
      fuelCapacity: 21.1,
    },
    {
      name: "Ghibli",
      slug: "maserati-ghibli",
      brand: "Maserati",
      category: "Luxury",
      year: 2024,
      pricePerDay: 129,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      seats: 5,
      color: "Blue",
      mileage: 7400,
      licensePlate: "NYC-MG-2024",
      description: "The Maserati Ghibli brings Italian flair to the luxury sedan segment. Its distinctive design and Ferrari-derived engine set it apart.",
      features: ["Harman Kardon Audio", "Skyhook Suspension", "Pieno Fiore Leather", "10.1\" Touchscreen", "ADAS Package", "Power Pedals"],
      engineSize: "3.0L Twin-Turbo V6",
      horsepower: 424,
      fuelCapacity: 18.5,
    },
    {
      name: "Continental GT",
      slug: "bentley-continental",
      brand: "Bentley",
      category: "Premium",
      year: 2024,
      pricePerDay: 449,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      seats: 4,
      color: "Burgundy",
      mileage: 4200,
      licensePlate: "NYC-BG-2024",
      description: "The Bentley Continental GT is the ultimate grand tourer. Handcrafted luxury meets breathtaking performance.",
      features: ["Naim Audio", "Rotating Display", "Diamond Knurling", "Mulliner Driving Specification", "Night Vision", "Adaptive Cruise"],
      isFeatured: true,
      engineSize: "4.0L Twin-Turbo V8",
      horsepower: 542,
      fuelCapacity: 24.0,
    },
    {
      name: "Phantom",
      slug: "rolls-royce-phantom",
      brand: "Rolls-Royce",
      category: "Premium",
      year: 2023,
      pricePerDay: 799,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      seats: 5,
      color: "Black",
      mileage: 1800,
      licensePlate: "NYC-RYP-24",
      description: "The Rolls-Royce Phantom is the apex of automotive luxury. Every detail is meticulously crafted to provide an unmatched experience.",
      features: ["Bespoke Audio", "Starlight Headliner", "Rear Theatre", "Champagne Cooler", "Lamb's Wool Floor Mats", "Coach Doors"],
      engineSize: "6.75L Twin-Turbo V12",
      horsepower: 563,
      fuelCapacity: 23.0,
    },
    {
      name: "DB12",
      slug: "aston-martin-db12",
      brand: "Aston Martin",
      category: "Luxury",
      year: 2024,
      pricePerDay: 399,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      seats: 4,
      color: "Green",
      mileage: 2900,
      licensePlate: "NYC-AM-2024",
      description: "The Aston Martin DB12 is a powerfully elegant grand tourer. British craftsmanship with world-class performance.",
      features: ["Bowers & Wilkins Audio", "Adaptive Damping", "Carbon Fiber Trim", "10.25\" Touchscreen", "Surround View", "Wireless Android Auto"],
      engineSize: "4.0L Twin-Turbo V8",
      horsepower: 671,
      fuelCapacity: 18.0,
    },
    {
      name: "720S",
      slug: "mclaren-720s",
      brand: "McLaren",
      category: "Sports",
      year: 2023,
      pricePerDay: 499,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      seats: 2,
      color: "Orange",
      mileage: 1500,
      licensePlate: "NYC-M7-2024",
      description: "The McLaren 720S is an aerodynamic marvel. Carbon fiber construction and a twin-turbo V8 deliver mind-bending performance.",
      features: ["Variable Drift Control", "McLaren Track Telemetry", "Dihedral Doors", "Bowers & Wilkins Audio", "Folding Driver Display", "Proactive Chassis Control"],
      engineSize: "4.0L Twin-Turbo V8",
      horsepower: 710,
      fuelCapacity: 19.0,
    },
    {
      name: "Corvette Stingray",
      slug: "corvette-stingray",
      brand: "Corvette",
      category: "Sports",
      year: 2024,
      pricePerDay: 179,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      seats: 2,
      color: "Red",
      mileage: 6700,
      licensePlate: "NYC-CV-2024",
      description: "The Corvette Stingray redefines the American sports car. Mid-engine design, stunning looks, and incredible value.",
      features: ["Magnetic Ride Control", "Performance Exhaust", "Bose Audio", "Head-Up Display", "Wireless Apple CarPlay", "Performance Data Recorder"],
      engineSize: "6.2L V8",
      horsepower: 490,
      fuelCapacity: 18.5,
    },
    {
      name: "Model 3",
      slug: "tesla-model-3",
      brand: "Tesla",
      category: "Electric",
      year: 2024,
      pricePerDay: 79,
      fuelType: "ELECTRIC" as const,
      transmission: "AUTOMATIC" as const,
      seats: 5,
      color: "White",
      mileage: 14200,
      licensePlate: "NYC-T3-2024",
      description: "The Tesla Model 3 is the world's most popular electric sedan. Zero emissions, maximum performance, and Autopilot technology.",
      features: ["Autopilot", "15\" Touchscreen", "Premium Audio", "Glass Roof", "Wireless Charging", "OTA Updates", "Sentry Mode"],
      horsepower: 283,
      fuelCapacity: 0,
    },
    {
      name: "7 Series",
      slug: "bmw-7-series",
      brand: "BMW",
      category: "Premium",
      year: 2024,
      pricePerDay: 219,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      seats: 5,
      color: "Silver",
      mileage: 5800,
      licensePlate: "NYC-B7-2024",
      description: "The BMW 7 Series is the flagship luxury sedan. Cutting-edge technology and opulent comfort for the discerning traveler.",
      features: ["Bowers & Wilkins Audio", "Theatre Screen", "Air Suspension", "Crystal Gear Shift", "Executive Lounge", "Driving Assistant Professional"],
      engineSize: "3.0L Turbo Inline-6",
      horsepower: 375,
      fuelCapacity: 19.5,
    },
    {
      name: "AMG GT",
      slug: "mercedes-amg-gt",
      brand: "Mercedes-Benz",
      category: "Sports",
      year: 2024,
      pricePerDay: 329,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      seats: 4,
      color: "Silver",
      mileage: 4100,
      licensePlate: "NYC-AG-2024",
      description: "The Mercedes-AMG GT delivers handcrafted performance with its twin-turbo V8 engine and race-bred dynamics.",
      features: ["AMG Performance Exhaust", "RACE Mode", "Burmester Audio", "AMG Track Pace", "Carbon Fiber Trim", "Adaptive Damping"],
      engineSize: "4.0L Twin-Turbo V8",
      horsepower: 523,
      fuelCapacity: 19.4,
    },
  ];

  const carIds: string[] = [];
  for (const c of carData) {
    const car = await prisma.car.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        name: c.name,
        slug: c.slug,
        brandId: brands[c.brand],
        categoryId: categories[c.category],
        year: c.year,
        pricePerDay: c.pricePerDay,
        fuelType: c.fuelType,
        transmission: c.transmission,
        seats: c.seats,
        color: c.color,
        mileage: c.mileage,
        licensePlate: c.licensePlate,
        description: c.description,
        features: c.features,
        isFeatured: c.isFeatured ?? false,
        status: "AVAILABLE",
        engineSize: c.engineSize,
        horsepower: c.horsepower,
        fuelCapacity: c.fuelCapacity,
      },
    });
    carIds.push(car.id);
  }
  console.log(`✓ ${carIds.length} cars created`);

  // ── Car Images ───────────────────────────
  let imageCount = 0;
  for (let i = 0; i < carIds.length; i++) {
    const carId = carIds[i];
    for (let j = 0; j < 3; j++) {
      await prisma.carImage.create({
        data: {
          carId,
          url: `https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&sig=${carId.slice(0, 8)}-${j}`,
          alt: `Car image ${j + 1}`,
          isPrimary: j === 0,
          order: j,
        },
      });
      imageCount++;
    }
  }
  console.log(`✓ ${imageCount} car images created`);

  // ── Settings ─────────────────────────────
  const settingsData = [
    { key: "company_name", value: "DriveRent", label: "Company Name", category: "GENERAL" as const, isPublic: true },
    { key: "company_email", value: "support@driverent.com", label: "Company Email", category: "GENERAL" as const, isPublic: true },
    { key: "company_phone", value: "+1 (800) 555-DRIVE", label: "Company Phone", category: "GENERAL" as const, isPublic: true },
    { key: "min_rental_days", value: "1", label: "Minimum Rental Days", category: "BOOKING" as const, type: "number" },
    { key: "max_rental_days", value: "90", label: "Maximum Rental Days", category: "BOOKING" as const, type: "number" },
    { key: "cancellation_hours", value: "24", label: "Free Cancellation Hours", category: "BOOKING" as const, type: "number" },
    { key: "tax_rate", value: "0.08", label: "Tax Rate (8%)", category: "PAYMENT" as const, type: "number" },
    { key: "security_deposit", value: "500", label: "Default Security Deposit", category: "PAYMENT" as const, type: "number" },
    { key: "currency", value: "USD", label: "Currency", category: "PAYMENT" as const, isPublic: true },
    { key: "primary_color", value: "#000000", label: "Primary Brand Color", category: "GENERAL" as const, type: "color", isPublic: true },
  ];

  for (const s of settingsData) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log(`✓ ${settingsData.length} settings created`);

  // ── Coupons ──────────────────────────────
  const couponData = [
    {
      code: "WELCOME20",
      description: "20% off your first rental",
      type: "PERCENTAGE" as const,
      value: 20,
      maximumDiscount: 100,
      usageLimit: 1000,
      startsAt: new Date("2024-01-01"),
      expiresAt: new Date("2025-12-31"),
    },
    {
      code: "SUMMER25",
      description: "25% off summer rentals",
      type: "PERCENTAGE" as const,
      value: 25,
      maximumDiscount: 150,
      usageLimit: 500,
      startsAt: new Date("2024-06-01"),
      expiresAt: new Date("2024-08-31"),
    },
    {
      code: "FLAT50",
      description: "$50 off any rental",
      type: "FIXED_AMOUNT" as const,
      value: 50,
      minimumAmount: 200,
      usageLimit: 200,
      startsAt: new Date("2024-01-01"),
      expiresAt: new Date("2025-06-30"),
    },
  ];

  for (const c of couponData) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }
  console.log(`✓ ${couponData.length} coupons created`);

  console.log("\n✓ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
