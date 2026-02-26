import type { Metadata } from 'next';
import { Outfit, Space_Grotesk } from 'next/font/google';

import './globals.css';
import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/NavBar';
import { AuthProvider } from '@/context/AuthContext';

const headingFont = Outfit({ subsets: ['latin'], variable: '--font-heading', weight: ['500', '600', '700'] });
const bodyFont = Space_Grotesk({ subsets: ['latin'], variable: '--font-body', weight: ['400', '500', '600'] });

export const metadata: Metadata = {
  title: 'PL Store',
  description: 'Production-grade full-stack e-commerce assessment project',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body suppressHydrationWarning>
        <AuthProvider>
          <main className="app-shell">
            <span className="floating-orb one" />
            <span className="floating-orb two" />
            <NavBar />
            <section className="page-wrap">{children}</section>
            <Footer />
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
