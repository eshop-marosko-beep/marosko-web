import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/navigation";
import AdminPanel from "@/components/rental/AdminPanel";
import { isPreviewDeployment, LIVE_ADMIN_URL } from "@/lib/rental/preview";
import { getCurrentUser } from "@/lib/rental/users";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administrácia požičovne | Marosko",
  robots: { index: false, follow: false },
};

export default async function RentalAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (isPreviewDeployment()) {
    return (
      <div className="py-16 max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-espresso-800 mb-4">Toto je testovacia verzia webu</h1>
        <p className="text-gray-700 mb-6">
          Administrácia požičovne funguje len na ostrom webe. Zmeny urobené tu by sa na www.marosko.sk neprejavili.
        </p>
        <a href={LIVE_ADMIN_URL} className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700">
          Otvoriť administráciu na www.marosko.sk
        </a>
      </div>
    );
  }

  const user = await getCurrentUser();
  if (!user) return redirect({ href: { pathname: "/ucet/prihlasenie", query: { next: "/ucet/admin" } }, locale });
  if (!user.isAdmin) return redirect({ href: "/ucet", locale });

  return (
    <div className="py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-espresso-800 mb-6">Administrácia požičovne</h1>
      <AdminPanel />
    </div>
  );
}
