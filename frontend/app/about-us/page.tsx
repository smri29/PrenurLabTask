export default function AboutUsPage() {
  return (
    <article className="glass-card rounded-2xl p-6 md:p-8">
      <h1 className="section-title text-3xl font-semibold text-slate-900">About Us</h1>
      <p className="subtle-text mt-2">PL Store is a full-stack e-commerce assessment platform.</p>

      <div className="mt-6 space-y-4 text-slate-700">
        <section>
          <h2 className="section-title text-xl font-semibold text-slate-900">Mission</h2>
          <p className="mt-1">Deliver a clean, secure, and user-friendly shopping experience with modern full-stack engineering practices.</p>
        </section>
        <section>
          <h2 className="section-title text-xl font-semibold text-slate-900">Tech Stack</h2>
          <p className="mt-1">Next.js frontend, Express API, MongoDB database, and JWT cookie authentication.</p>
        </section>
        <section>
          <h2 className="section-title text-xl font-semibold text-slate-900">Project Scope</h2>
          <p className="mt-1">Includes auth, role-based admin control, product CRUD, cart, order placement, and analytics reporting.</p>
        </section>
      </div>
    </article>
  );
}
