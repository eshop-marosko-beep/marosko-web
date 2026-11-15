import Image from "next/image";
import type { EshopPromo, PromoLabel } from "@/lib/eshopPromos";

/** Shared pieces for sale products loaded from the e-shop (lib/eshopPromos),
 * used on /akcie and in the home page "top deals" section. */

export function PromoLabelBadge({ label }: { label: PromoLabel }) {
  return (
    <span
      className="inline-block rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide"
      style={{ backgroundColor: label.background ?? "#b7551f", color: label.color ?? "#fff" }}
    >
      {label.text}
    </span>
  );
}

export function PromoStock({ product }: { product: EshopPromo }) {
  if (!product.stockStatus) return null;
  const inStock = /skladom|skladem|în stoc|ultima/i.test(product.stockStatus);
  return (
    <p className={`text-sm ${inStock ? "text-green-700" : "text-espresso-400"}`}>
      {product.stockStatus}
      {product.stockQuantity ? ` (${product.stockQuantity})` : ""}
    </p>
  );
}

export function PromoImage({ product, sizes, priority }: { product: EshopPromo; sizes: string; priority?: boolean }) {
  if (!product.image) return <div className="aspect-square bg-cream-100" />;
  return (
    <div className="relative aspect-square bg-white">
      <Image
        src={product.image}
        alt={product.title}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized
        className="object-contain p-4 group-hover:scale-105 transition-transform"
      />
    </div>
  );
}

/** Grid card linking to the product on eshop.marosko.sk. */
export default function PromoCard({ product, sizes }: { product: EshopPromo; sizes: string }) {
  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group h-full bg-white rounded-xl shadow-lg overflow-hidden border border-transparent hover:border-amber-200 hover:shadow-xl transition-all flex flex-col"
    >
      <div className="relative">
        <PromoImage product={product} sizes={sizes} />
        {product.discountPercent && (
          <span className="absolute top-2 left-2 rounded-full bg-amber-600 text-white text-sm font-bold px-2 py-0.5">
            −{product.discountPercent}
          </span>
        )}
      </div>
      <div className="p-3 md:p-4 flex flex-col flex-1">
        {product.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.labels.slice(0, 2).map((label) => (
              <PromoLabelBadge key={label.text} label={label} />
            ))}
          </div>
        )}
        <h3 className="text-sm md:text-base font-semibold text-espresso-800 line-clamp-3 mb-3">{product.title}</h3>
        <div className="mt-auto">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-lg font-bold text-amber-700">{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-espresso-300 line-through">{product.originalPrice}</span>
            )}
          </div>
          <PromoStock product={product} />
        </div>
      </div>
    </a>
  );
}
