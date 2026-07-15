import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={locale} className="scroll-smooth">
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="min-h-screen bg-cream-50">
            <Nav locale={locale} />

            {/* Hlavný obsah */}
            <main className="container mx-auto p-4 py-12">
              {children}
            </main>

            {/* Pätička */}
            <footer className="bg-espresso-900 text-cream-100 text-center p-4 mt-12">
              <div className="container mx-auto">
                © 2026 Marián s.r.o. - {messages.footer.rights}
              </div>
            </footer>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}