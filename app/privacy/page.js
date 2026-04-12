import PageHeading from "@/components/PageHeading";

const LAST_UPDATED = "April 8, 2026";
const CONTACT_EMAIL = "info@olyaholidayhomes.com";
const SITE_URL = "https://olyaholidayhomes.com/";

export const metadata = {
  title: "Privacy policy",
  description:
    "How Olya Holiday Homes collects, uses, and protects your personal information.",
};

function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-foreground/75">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeading
        title="Privacy policy"
        subtitle="How we handle personal information when you use Olya Holiday Homes."
      />
      <p className="mb-10 text-sm text-foreground/60">
        Last updated: {LAST_UPDATED}
      </p>

      <div className="space-y-10">
        <p className="text-sm leading-relaxed text-foreground/80">
          Olya Holiday Homes (“we”, “us”, “our”) respects your privacy and is
          committed to protecting your personal data. This policy describes what
          we collect, why we collect it, and how we keep it safe. It applies to
          our website and services at{" "}
          <a
            href={SITE_URL}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            {SITE_URL.replace(/\/$/, "")}
          </a>
          .
        </p>

        <Section title="Information we collect">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground/90">Account details</strong> —
              such as your name and email address when you register or sign in
              with Google (or another provider we support).
            </li>
            <li>
              <strong className="text-foreground/90">Booking-related data</strong>{" "}
              — information you provide to complete or manage a booking (for
              example guest count, dates, and messages needed to arrange your
              stay).
            </li>
            <li>
              <strong className="text-foreground/90">Usage data</strong> — limited
              technical and usage information (such as device type, browser, and
              general interaction patterns) to improve reliability, security, and
              the quality of our services.
            </li>
            <li>
              <strong className="text-foreground/90">Cookies and similar tech</strong>{" "}
              — we may use cookies or similar technologies where needed for
              security, preferences, and analytics. You can control many cookies
              through your browser settings.
            </li>
          </ul>
        </Section>

        <Section title="How we use your data">
          <ul className="list-disc space-y-2 pl-5">
            <li>To create, secure, and manage your account.</li>
            <li>To provide booking, payment, and customer support services.</li>
            <li>To communicate with you about your account, bookings, or service updates.</li>
            <li>To detect fraud, abuse, and technical issues, and to comply with legal obligations.</li>
            <li>To analyse aggregated usage so we can improve the platform (without selling your personal data).</li>
          </ul>
        </Section>

        <Section title="Legal bases and retention">
          <p>
            We process personal data where it is necessary to perform our contract
            with you, where we have a legitimate interest that is not overridden by
            your rights, or where we have your consent or a legal obligation. We
            retain information only as long as needed for those purposes, unless
            a longer period is required by law.
          </p>
        </Section>

        <Section title="Data sharing">
          <p>
            We do <strong className="text-foreground/90">not</strong> sell your
            personal data. We may share data with trusted service providers who
            help us operate the platform—for example payment processors, cloud
            hosting, email delivery, or analytics—under strict confidentiality and
            only as needed for their service. We may also disclose information if
            required by law or to protect the rights and safety of our users and
            the public.
          </p>
        </Section>

        <Section title="Security">
          <p>
            We use appropriate technical and organisational measures designed to
            protect your data against unauthorised access, loss, or misuse. No
            method of transmission over the internet is completely secure; we
            encourage you to use a strong password and keep your login details
            private.
          </p>
        </Section>

        <Section title="Your choices">
          <p>
            Depending on your location, you may have rights to access, correct,
            delete, or restrict certain processing of your personal data, or to
            object to some uses. To make a request, contact us using the email
            below. We will respond in line with applicable law.
          </p>
        </Section>

        <Section title="Children">
          <p>
            Our services are not directed at children under 16. We do not knowingly
            collect personal data from children. If you believe we have collected
            such data, please contact us and we will take appropriate steps.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this privacy policy from time to time. When we do, we will
            revise the “Last updated” date at the top of this page. Material
            changes may be communicated through the site or by email where
            appropriate.
          </p>
        </Section>

        <Section title="Contact us">
          <p>
            If you have questions about this policy or our use of your data,
            contact us at:{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>

        <p className="border-t border-zinc-200/80 pt-8 text-xs leading-relaxed text-foreground/55">
          This policy is provided for general information and does not constitute
          legal advice. You may wish to have it reviewed by counsel for your
          specific situation and jurisdiction.
        </p>
      </div>
    </div>
  );
}
