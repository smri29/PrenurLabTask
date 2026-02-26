import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-4 md:px-6">
      <div className="mx-auto w-full max-w-6xl rounded-2xl px-5 py-4 glass-soft">
        <div className="flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <p className="brand-title text-base font-semibold text-slate-800">PL Store</p>
            <p className="subtle-text text-sm">
              Built by{' '}
              <a
                href="https://linkedin.com/in/smri29"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sky-700 underline decoration-sky-500/70 underline-offset-2 hover:text-sky-800"
              >
                Shah Mohammad Rizvi
              </a>
              .
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-3 text-sm">
            <Link href="/terms-of-service" className="subtle-text hover:text-slate-900 hover:underline">
              Terms of Service
            </Link>
            <Link href="/privacy-policy" className="subtle-text hover:text-slate-900 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/about-us" className="subtle-text hover:text-slate-900 hover:underline">
              About Us
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};
