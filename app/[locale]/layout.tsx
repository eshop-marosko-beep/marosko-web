import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="min-h-screen bg-gray-50">
            {/* Navigácia */}
            <nav className="bg-white shadow-lg p-4">
              <div className="container mx-auto flex justify-between items-center">
                <Link href={`/${locale}`} className="text-2xl font-bold text-amber-700 hover:text-amber-800">
                  Maroško
                </Link>
                <div className="space-x-6">
                  <Link href={`/${locale}`} className="hover:text-amber-700">
                    {messages.navigation?.home || 'Domov'}
                  </Link>
                  <Link href={`/${locale}/o-nas`} className="hover:text-amber-700">
                    {messages.navigation?.about || 'O nás'}
                  </Link>
                  <Link href={`/${locale}/kategorie`} className="hover:text-amber-700">
                    {messages.navigation?.services || 'Kategórie'}
                  </Link>
                  <Link href={`/${locale}/galeria`} className="hover:text-amber-700">
                    {messages.navigation?.gallery || 'Galéria'}
                  </Link>
                  <Link href={`/${locale}/kontakt`} className="hover:text-amber-700">
                    {messages.navigation?.contact || 'Kontakt'}
                  </Link>
                  <a href="https://eshop.marosko.sk" target="_blank" className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
                    🛒 E-shop
                  </a>
                  <Link href="/sk" className="text-sm border px-2 py-1 rounded hover:bg-gray-100">SK</Link>
                  <Link href="/cz" className="text-sm border px-2 py-1 rounded hover:bg-gray-100">CZ</Link>
                  <Link href="/en" className="text-sm border px-2 py-1 rounded hover:bg-gray-100">EN</Link>
                  <Link href="/ro" className="text-sm border px-2 py-1 rounded hover:bg-gray-100">RO</Link>
                </div>
              </div>
            </nav>

            {/* Hlavný obsah */}
            <main className="container mx-auto p-4 py-12">
              {children}
            </main>

            {/* Pätička */}
            <footer className="bg-gray-800 text-white text-center p-4 mt-12">
              <div className="container mx-auto">
                © 2026 Maroško s.r.o. - Všetky práva vyhradené
              </div>
            </footer>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}