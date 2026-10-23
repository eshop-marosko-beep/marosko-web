import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/navigation";
import AdminPanel from "@/components/rental/AdminPanel";
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
