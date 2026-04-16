import Link from "next/link";
import PageHeading from "@/components/PageHeading";
import { APP_DISPLAY_NAME } from "@/lib/brand";

const LAST_UPDATED = "April 8, 2026";
const CONTACT_EMAIL = "info@olyaholidayhomes.com";
const SITE_URL = "https://olyaholidayhomes.com/";

export const metadata = {
  title: "Terms of service",
  description: `Terms governing your use of ${APP_DISPLAY_NAME} and our booking platform.`,
};

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <h2 className="text-base font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-foreground/75">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeading
        title="Terms of service"
        subtitle={`Rules for using ${APP_DISPLAY_NAME}. Please read them carefully.`}
      />
      <p className="mb-10 text-sm text-foreground/60">
        Last updated: {LAST_UPDATED}
      </p>

      <div className="space-y-10">
        <p className="text-sm leading-relaxed text-foreground/80">
          Welcome to <strong className="text-foreground/90">{APP_DISPLAY_NAME}</strong>.
          By accessing or using our platform at{" "}
          <a
            href={SITE_URL}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            {SITE_URL.replace(/\/$/, "")}
          </a>
          , you agree to comply with and be bound by these Terms of Service. If you
          do not agree, please do not use the platform.
        </p>

        <Section id="use" title="1. Use of the platform">
          <p>
            Our platform allows users to browse, book, and manage short-term rental
            stays and related services. You agree to use the platform only for
            lawful purposes, in accordance with these terms, and in a way that does
            not infringe the rights of others or restrict their use of the service.
          </p>
        </Section>

        <Section id="accounts" title="2. User accounts">
          <ul className="list-disc space-y-2 pl-5">
            <li>You must provide accurate and complete information when creating an account.</li>
            <li>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your account.
            </li>
            <li>
              You must notify us promptly if you suspect unauthorised access to your account.
            </li>
          </ul>
        </Section>

        <Section id="bookings" title="3. Bookings and payments">
          <ul className="list-disc space-y-2 pl-5">
            <li>All bookings are subject to availability and host confirmation where applicable.</li>
            <li>
              Payments are processed securely through third-party payment providers
              (for example Stripe or other processors we integrate). Their terms may
              also apply to payment transactions.
            </li>
            <li>
              By completing a booking, you agree to pay the total amount shown at
              checkout, including applicable taxes and fees as displayed.
            </li>
          </ul>
        </Section>

        <Section id="cancellation" title="4. Cancellation and refunds">
          <p>
            Guest cancellations and refunds on our platform follow the{" "}
            <Link href="/policy/" className="font-medium text-primary underline-offset-2 hover:underline">
              Refund &amp; cancellation policy
            </Link>
            . The summary below is for convenience; if anything conflicts, the policy page and the rules enforced by our
            systems at the time you cancel apply.
          </p>
          <p className="font-medium text-foreground/85">Guest stays (paid bookings)</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Within 1 hour</strong> of placing a paid booking: <strong>full refund</strong> of the stay amount charged.
            </li>
            <li>
              <strong>More than 48 hours</strong> before check-in (as defined in the refund policy): <strong>full refund</strong>.
            </li>
            <li>
              <strong>More than 24 hours but 48 hours or less</strong> before check-in: <strong>50% refund</strong> of the stay total.
            </li>
            <li>
              <strong>24 hours or less</strong> before check-in: <strong>no refund</strong>. You may still cancel to release dates where the
              product allows it.
            </li>
            <li>
              Refund <strong>eligibility and amounts</strong> are calculated on our servers when you cancel — do not rely on amounts shown only
              in your browser.
            </li>
            <li>
              Approved refunds are returned to the <strong>original payment method</strong>; timing depends on banks and networks (often{" "}
              <strong>5–10 business days</strong>).
            </li>
          </ul>
          <p className="font-medium text-foreground/85">Other</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              If you have not completed payment, you may cancel where the product allows; there is nothing to refund until a successful
              charge.
            </li>
            <li>
              Cancellations and refunds may also be subject to mandatory consumer rights in your jurisdiction where they cannot be waived.
            </li>
            <li>
              Certain fees or add-ons may be non-refundable as stated at checkout.
            </li>
          </ul>
        </Section>

        <Section id="listings" title="5. Property listings">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Property owners and hosts are responsible for the accuracy of their
              listings, including descriptions, photos, amenities, and house rules.
            </li>
            <li>
              We do not guarantee the quality, safety, suitability, or legality of any
              listed property. Stays are offered by third parties; your agreement is
              with the host as described in the booking flow.
            </li>
            <li>
              We may remove, suspend, or modify listings or accounts at our discretion,
              including for policy violations or legal requirements.
            </li>
          </ul>
        </Section>

        <Section id="prohibited" title="6. Prohibited activities">
          <p>You agree not to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Use the platform for fraudulent, harmful, or illegal activities.</li>
            <li>Interfere with or disrupt the operation, security, or integrity of the platform.</li>
            <li>
              Attempt to gain unauthorised access to accounts, systems, or data
              belonging to us, hosts, or other users.
            </li>
            <li>Scrape, harvest, or misuse data from the platform without our written permission.</li>
          </ul>
        </Section>

        <Section id="liability" title="7. Limitation of liability">
          <p>
            To the fullest extent permitted by applicable law, {APP_DISPLAY_NAME} and
            its affiliates will not be liable for any indirect, incidental, special,
            consequential, or punitive damages, or for loss of profits, data, or
            goodwill, arising from your use of the platform or any booking.
          </p>
          <p>
            We are not responsible for disputes between guests and hosts, or for
            issues arising from the condition or use of a property. Our total
            liability for claims relating to the platform is limited to the greater of
            (a) the amount you paid us in fees for the transaction giving rise to the
            claim in the twelve months before the claim, or (b) one hundred UAE dirhams
            (AED 100), except where liability cannot be limited by law.
          </p>
        </Section>

        <Section id="termination" title="8. Termination">
          <p>
            We may suspend or terminate your access to the platform at any time,
            with or without notice, if you violate these terms, create risk or legal
            exposure for us or others, or where we are required to do so by law. You
            may stop using the platform at any time.
          </p>
        </Section>

        <Section id="changes" title="9. Changes to these terms">
          <p>
            We may update these Terms of Service from time to time. We will post the
            updated version on this page and revise the “Last updated” date. Your
            continued use of the platform after changes become effective constitutes
            acceptance of the revised terms, except where a stricter notice period is
            required by law.
          </p>
        </Section>

        <Section id="contact" title="10. Contact us">
          <p>
            If you have questions about these Terms, please contact us:
          </p>
          <ul className="list-none space-y-1 pl-0">
            <li>
              Email:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              Website:{" "}
              <a
                href={SITE_URL}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {SITE_URL.replace(/\/$/, "")}
              </a>
            </li>
          </ul>
        </Section>

        <p className="border-t border-zinc-200/80 pt-8 text-xs leading-relaxed text-foreground/55">
          These terms are a general template. They are not a substitute for legal
          advice. Have them reviewed by qualified counsel before relying on them in
          production, especially for UAE consumer and tourism regulations.
        </p>
      </div>
    </div>
  );
}
