import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from '@/components/LanguageSwitcher';

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
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} className="scroll-smooth">
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="min-h-screen bg-cream-50">
            {/* Navigácia */}
            <nav className="bg-white shadow-lg p-4 border-b-2 border-amber-100">
              <div className="container mx-auto flex justify-between items-center">
                <Link href={`/${locale}`} className="flex items-center hover:opacity-80 transition-opacity">
                  <Image
                    src="/brand/marian-logo.jpg"
                    alt="Marián s.r.o."
                    width={220}
                    height={70}
                    priority
                    className="h-12 w-auto md:h-14"
                  />
                </Link>
                <div className="space-x-6">
                  <Link href={`/${locale}`} className="hover:text-amber-700">
                    {messages.navigation.home}
                  </Link>
                  <Link href={`/${locale}/o-nas`} className="hover:text-amber-700">
                    {messages.navigation.about}
                  </Link>
                  <Link href={`/${locale}/kategorie`} className="hover:text-amber-700">
                    {messages.navigation.services}
                  </Link>
                  <Link href={`/${locale}/galeria`} className="hover:text-amber-700">
                    {messages.navigation.gallery}
                  </Link>
                  <Link href={`/${locale}/blog`} className="hover:text-amber-700">
                    {messages.navigation.blog}
                  </Link>
                  <Link href={`/${locale}/obchody`} className="hover:text-amber-700">
                    {messages.navigation.shops}
                  </Link>
                  <Link href={`/${locale}/kontakt`} className="hover:text-amber-700">
                    {messages.navigation.contact}
                  </Link>
                  <a href="https://eshop.marosko.sk" target="_blank" className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
                    🛒 E-shop
                  </a>
                  <LanguageSwitcher />
                </div>
              </div>
            </nav>

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