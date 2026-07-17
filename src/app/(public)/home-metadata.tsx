import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "DriveRent offers premium and luxury car rentals. Browse our fleet of 200+ vehicles from brands like BMW, Porsche, Tesla, and Lamborghini. Book your dream car today.",
  openGraph: {
    title: "DriveRent — Premium Car Rental",
    description:
      "Rent luxury and premium vehicles with ease. Browse 200+ cars from the world's finest brands.",
  },
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DriveRent",
  url: "https://driverent.com",
  logo: "https://driverent.com/logo.png",
  description: "Premium car rental service with luxury vehicles from top brands.",
  sameAs: [
    "https://twitter.com/driverent",
    "https://instagram.com/driverent",
    "https://facebook.com/driverent",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-800-555-DRIVE",
    contactType: "customer service",
    availableLanguage: "English",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Luxury Lane",
    addressLocality: "Miami",
    addressRegion: "FL",
    postalCode: "33101",
    addressCountry: "US",
  },
};

export default function HomeMetadata() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />
    </>
  );
}
