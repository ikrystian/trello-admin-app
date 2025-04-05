import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trello Time Report | Śledzenie i Raportowanie Godzin Pracy",
  description: "Śledź czas spędzony na zadaniach w Trello i generuj szczegółowe raporty dla zwiększenia produktywności zespołu.",
  keywords: ["trello", "śledzenie czasu", "produktywność", "zarządzanie projektami", "współpraca zespołowa"],
  authors: [{ name: "Zespół Trello Time Report" }],
  creator: "Trello Time Report",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://trello-time-report.com",
    title: "Trello Time Report | Śledzenie i Raportowanie Godzin Pracy",
    description: "Śledź czas spędzony na zadaniach w Trello i generuj szczegółowe raporty dla zwiększenia produktywności zespołu.",
    siteName: "Trello Time Report",
  },
};

// Remove generateStaticParams as it's no longer needed for single language

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  // Remove params: { lang: string };
}>) {
  return (
    <html lang="pl" className="scroll-smooth" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster richColors closeButton position="top-center" />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
