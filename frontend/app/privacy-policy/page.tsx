export default function PrivacyPolicyPage() {
  return (
    <article className="glass-card rounded-2xl p-6 md:p-8">
      <h1 className="section-title text-3xl font-semibold text-slate-900">Privacy Policy</h1>
      <p className="subtle-text mt-2">Last updated: February 26, 2026</p>

      <div className="mt-6 space-y-6 text-slate-700">
        <section>
          <h2 className="section-title text-xl font-semibold text-slate-900">Collected Data</h2>
          <p className="mt-1">
            We store account details required for authentication and order processing, such as name, email, role, cart
            content, and order records.
          </p>
        </section>
        <section>
          <h2 className="section-title text-xl font-semibold text-slate-900">Authentication Cookies</h2>
          <p className="mt-1">
            JWT auth uses HTTP-only cookies to maintain secure session access. These cookies are not exposed to
            browser JavaScript and are transmitted according to configured security flags.
          </p>
        </section>
        <section>
          <h2 className="section-title text-xl font-semibold text-slate-900">Data Security</h2>
          <p className="mt-1">
            Passwords are hashed and sensitive configuration values are managed via environment variables. Access to
            administrative endpoints is restricted by role-based middleware.
          </p>
        </section>
        <section>
          <h2 className="section-title text-xl font-semibold text-slate-900">How Data Is Used</h2>
          <p className="mt-1">
            Data is used to authenticate users, build shopping carts, place orders, generate reports, and operate the
            frontend experience.
          </p>
        </section>
        <section>
          <h2 className="section-title text-xl font-semibold text-slate-900">Data Retention</h2>
          <p className="mt-1">
            Data is retained while accounts and order history remain active in the system. In production, a retention
            policy should define archival and deletion windows.
          </p>
        </section>
        <section>
          <h2 className="section-title text-xl font-semibold text-slate-900">Third-Party Services</h2>
          <p className="mt-1">
            The system may rely on infrastructure providers for hosting and database services. Their platform-level
            controls apply alongside this project’s own security measures.
          </p>
        </section>
        <section>
          <h2 className="section-title text-xl font-semibold text-slate-900">User Rights</h2>
          <p className="mt-1">
            Users can request updates to incorrect profile data and request account removal in a production
            implementation.
          </p>
        </section>
        <section>
          <h2 className="section-title text-xl font-semibold text-slate-900">Contact</h2>
          <p className="mt-1">
            For project questions, contact the builder through the linked profile in the footer.
          </p>
        </section>
      </div>
    </article>
  );
}
