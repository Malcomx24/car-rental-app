import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and conditions governing your use of DriveRent premium car rental services.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">Last updated: January 15, 2025</p>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using DriveRent services, you agree to be bound by these Terms of Service.
            If you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">2. Eligibility</h2>
          <p className="text-muted-foreground leading-relaxed">
            You must be at least 21 years old and possess a valid driver&apos;s license to rent a vehicle.
            Certain luxury and specialty vehicles may have higher age requirements. You must also have
            a valid credit card in your name.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">3. Bookings &amp; Payments</h2>
          <div className="text-muted-foreground leading-relaxed space-y-2">
            <ul className="list-disc pl-6 space-y-1">
              <li>A valid credit card is required to make a reservation</li>
              <li>Full payment is due at the time of pickup</li>
              <li>A security deposit may be held on your card</li>
              <li>Cancellations made 24+ hours before pickup receive a full refund</li>
              <li>Late cancellations may incur a fee equivalent to one day&apos;s rental</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">4. Vehicle Use</h2>
          <div className="text-muted-foreground leading-relaxed space-y-2">
            <ul className="list-disc pl-6 space-y-1">
              <li>Vehicles must be operated by authorized drivers only</li>
              <li>No smoking in any rental vehicle</li>
              <li>Vehicles must not be used for illegal activities</li>
              <li>Off-road driving is prohibited unless the vehicle is designed for it</li>
              <li>You are responsible for all traffic violations during your rental period</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">5. Insurance &amp; Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            Basic insurance coverage is included with every rental. Additional coverage options
            (Basic Insurance, Premium Insurance) are available for purchase. You are financially
            responsible for any damage not covered by insurance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">6. Late Returns &amp; Fees</h2>
          <p className="text-muted-foreground leading-relaxed">
            Vehicles must be returned by the agreed-upon time. Late returns will incur additional
            charges at the applicable daily rate. Fuel charges apply if the vehicle is not returned
            with the same fuel level as at pickup.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">7. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            For questions about these Terms, contact us at <strong>legal@driverent.com</strong> or
            call <strong>+1 (800) 555-DRIVE</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
