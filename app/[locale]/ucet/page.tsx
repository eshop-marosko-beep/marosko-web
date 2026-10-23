import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, redirect } from "@/navigation";
import { buildMetadata } from "@/lib/seo";
import LogoutButton from "@/components/rental/LogoutButton";
import { userBookings } from "@/lib/rental/bookings";
import { getRentalTool } from "@/lib/rental/rentalData";
import { getCurrentUser } from "@/lib/rental/users";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rental.account" });
  return {
    ...buildMetadata({ locale, path: "/ucet", title: t("title"), description: t("title") }),
    robots: { index: false, follow: false },
  };
}

const STATUS_STYLE = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  declined: "bg-gray-200 text-gray-700",
} as const;

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) return redirect({ href: { pathname: "/ucet/prihlasenie", query: { next: "/ucet" } }, locale });

  const t = await getTranslations("rental");
  const bookings = await userBookings(user.email);

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-espresso-800">{t("account.title")}</h1>
        <LogoutButton />
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-8 text-gray-700 space-y-1">
        <p><strong>{user.name}</strong></p>
        <p>{user.email}</p>
        <p>{user.phone}</p>
      </div>

      <h2 className="text-2xl font-bold text-espresso-800 mb-4">{t("account.bookingsTitle")}</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-600 mb-6">{t("account.empty")}</p>
      ) : (
        <ul className="space-y-3 mb-6">
          {bookings.map((booking) => {
            const tool = getRentalTool(booking.toolSlug);
            return (
              <li key={booking.id} className="bg-white rounded-xl shadow p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-gray-700">
                  <p className="font-semibold text-espresso-800">
                    {tool ? t(`tools.${tool.translationKey}.name`) : booking.toolSlug}
                  </p>
                  <p className="text-sm">
                    {booking.from} – {booking.to} · {t("calendar.days", { count: booking.days })} · {booking.estimatedPrice} € · {t("deposit")} {booking.deposit} €
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLE[booking.status]}`}>
                  {t(`account.status.${booking.status}`)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <Link href="/pozicovna"
        className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors">
        {t("account.toRental")}
      </Link>
    </div>
  );
}
