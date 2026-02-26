export default function TermsOfServicePage() {
  return (
    <article className="glass-card rounded-2xl p-6 md:p-8">
      <h1 className="section-title text-3xl font-semibold text-slate-900">Terms of Service</h1>
      <p className="subtle-text mt-2">Last updated: February 26, 2026</p>

      <div className="mt-6 space-y-6 text-slate-700">
        <section>
          <h2 className="section-title text-xl font-semibold text-slate-900">Usage</h2>
          <p className="mt-1">
            You agree to use PL Store only for lawful purchase and account activities. Misuse, automated abuse,
            scraping, credential attacks, and fraudulent transactions are strictly prohibited.
          </p>
        </section>
        <section>
          <h2 className="section-title text-xl font-semibold text-slate-900">Accounts</h2>
          <p className="mt-1">
            You are responsible for securing your credentials and activity under your account. If you suspect
            unauthorized use, you should rotate credentials and notify the project owner immediately.
          </p>
        </section>
        <section>
          <h2 className="section-title text-xl font-semibold text-slate-900">Orders and Inventory</h2>
          <p className="mt-1">
            Orders are subject to stock availability and validation at checkout time. Product prices, availability,
            and descriptions may be updated over time, and order placement does not bypass validation rules.
          </p>
        </section>
        <section>
          <h2 className="section-title text-xl font-semibold text-slate-900">Payments and Pricing</h2>
          <p className="mt-1">
            This project is a technical assessment and does not process real card payments. Any pricing shown is for
            demonstration and testing behavior only.
          </p>
        </section>
        <section>
          <h2 className="section-title text-xl font-semibold text-slate-900">Acceptable Conduct</h2>
          <p className="mt-1">
            Users must not upload malicious payloads, exploit API endpoints, or attempt privilege escalation. Any
            abuse may result in immediate account suspension in a production scenario.
          </p>
        </section>
        <section>
          <h2 className="section-title text-xl font-semibold text-slate-900">Service Availability</h2>
          <p className="mt-1">
            The service may experience maintenance windows, feature updates, or intermittent downtime. No uptime SLA
            is provided for this assessment environment.
          </p>
        </section>
        <section>
          <h2 className="section-title text-xl font-semibold text-slate-900">Liability</h2>
          <p className="mt-1">
            Service is provided as-is for assessment/demo purposes without commercial warranty. The project owner is
            not liable for indirect or consequential damages arising from test usage.
          </p>
        </section>
        <section>
          <h2 className="section-title text-xl font-semibold text-slate-900">Changes to Terms</h2>
          <p className="mt-1">
            Terms can be updated as implementation evolves. Continued use after updates indicates acceptance of the
            latest terms.
          </p>
        </section>
      </div>
    </article>
  );
}
