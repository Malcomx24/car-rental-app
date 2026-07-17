import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How DriveRent collects, uses, and protects your personal information. Read our complete privacy policy.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: January 15, 2025</p>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-3">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            Welcome to DriveRent (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal
            information and your right to privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our car rental services and website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">2. Information We Collect</h2>
          <div className="text-muted-foreground leading-relaxed space-y-2">
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Personal Identification Information:</strong> Name, email address, phone number, date of birth, and driver&apos;s license details.</li>
              <li><strong>Payment Information:</strong> Credit card numbers, billing addresses, and transaction history.</li>
              <li><strong>Usage Data:</strong> Booking history, vehicle preferences, website interactions, and device information.</li>
              <li><strong>Location Data:</strong> Pickup and drop-off locations, and GPS data when applicable.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">3. How We Use Your Information</h2>
          <div className="text-muted-foreground leading-relaxed space-y-2">
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Process and manage your car rental bookings</li>
              <li>Verify your identity and driver&apos;s license</li>
              <li>Process payments and send invoices</li>
              <li>Send booking confirmations and updates</li>
              <li>Provide customer support</li>
              <li>Improve our services and website experience</li>
              <li>Send promotional communications (with your consent)</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">4. Information Sharing</h2>
          <p className="text-muted-foreground leading-relaxed">
            We do not sell your personal information. We may share your data with trusted third-party service
            providers who assist us in operating our business, such as payment processors, insurance providers,
            and location services. All third parties are contractually obligated to protect your information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">5. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement industry-standard security measures including SSL encryption, secure data storage,
            and regular security audits. However, no method of transmission over the Internet is 100% secure,
            and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">6. Your Rights</h2>
          <div className="text-muted-foreground leading-relaxed space-y-2">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access, correct, or delete your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">7. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <strong>privacy@driverent.com</strong> or call us at <strong>+1 (800) 555-DRIVE</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
