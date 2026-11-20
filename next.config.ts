import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // sharp's native libvips is loaded at runtime and the file tracer misses
  // it, so the TikTok photo route failed on Vercel with "libvips-cpp.so
  // cannot open shared object file". Ship the linux-x64 binaries with it.
  outputFileTracingIncludes: {
    '/tiktok-foto/\\[\\.\\.\\.path\\]': [
      './node_modules/@img/sharp-linux-x64/**/*',
      './node_modules/@img/sharp-libvips-linux-x64/**/*',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eshop.marosko.sk',
        pathname: '/resize/**',
      },
    ],
  },
  async redirects() {
    return [
      // AI product feed for eshop.marosko.sk. BiznisWeb cannot host custom
      // files, so the feed is generated daily from the BiznisWeb API on the
      // rezbarskenaradie.sk server. It used to be proxied here with a rewrite,
      // but every ~2 MB download by a bot then counted as Vercel Fast Origin
      // Transfer and pushed the Hobby team over its limit (Nov 2026). A
      // redirect sends bots to the real host, so Vercel serves only a few
      // bytes. Temporary, so the old URLs keep working if the host changes.
      {
        source: '/agent-feed.json',
        destination: 'https://www.rezbarskenaradie.sk/marosko/agent-feed.json',
        permanent: false,
      },
      // Czech (CZK) and Romanian (RON) versions of the same feed.
      {
        source: '/:lang(cz|ro)/agent-feed.json',
        destination: 'https://www.rezbarskenaradie.sk/marosko/:lang/agent-feed.json',
        permanent: false,
      },
      // Visiting the site via any *.vercel.app alias or per-deployment URL
      // (instead of the custom domain) is unprofessional to share/copy and
      // creates duplicate-content exposure outside the canonical domain.
      // Gated to VERCEL_ENV === "production" so this never applies to
      // preview/branch deployments — those are only ever reached via their
      // own *.vercel.app URL, and redirecting them to production would
      // defeat the point of testing a PR before it's merged.
      // /api/pinterest-feed/* is exempt: the Pinterest catalog feeds are
      // registered at the vercel.app URL and Pinterest's fetcher fails on the
      // redirect, which left the catalog stale.
      ...(process.env.VERCEL_ENV === "production"
        ? [
            {
              source: "/:path((?!api/pinterest-feed/).*)",
              has: [{ type: "host" as const, value: "^.*\\.vercel\\.app$" }],
              destination: "https://www.marosko.sk/:path*",
              permanent: true,
            },
          ]
        : []),
      // Gallery product pages removed 2026-11-15 (product no longer sold on the
      // e-shop). Send them to their gallery category instead of a 404.
      ...[
        ["frezovacie-kotuce", "p383"],
        ["prislusenstvo-priamej-brusky", "p1049"],
        ["prislusenstvo-priamej-brusky", "p561"],
      ].flatMap(([cat, key]) => [
        { source: `/galeria/${cat}/${key}`, destination: `/galeria/${cat}`, permanent: true },
        { source: `/:lang(sk|cz|en|ro)/galeria/${cat}/${key}`, destination: `/:lang/galeria/${cat}`, permanent: true },
      ]),
      // Legacy Joomla article URL from the site's previous CMS, still indexed
      // by search engines. Redirect it to the current page instead of 404ing.
      {
        source: '/index.php',
        has: [{ type: 'query', key: 'id', value: '25:gdpr' }],
        destination: '/gdpr?',
        permanent: true,
      },
      // Legacy Joomla "info" (company info) SEF URL, still indexed by search
      // engines. Redirect it to the current About Us page instead of 404ing.
      {
        source: '/index.php/info',
        destination: '/o-nas',
        permanent: true,
      },
      // Legacy Joomla article about the Arbortech brand, still indexed by
      // search engines. Redirect it to the matching brand card instead of
      // 404ing.
      {
        source: '/index.php/home',
        destination: '/znacky#arbortech',
        permanent: true,
      },
      // Same legacy Arbortech article, indexed under a nested Joomla menu
      // path. Same redirect target as /index.php/home.
      {
        source: '/index.php/home/arbortech',
        destination: '/znacky#arbortech',
        permanent: true,
      },
      // Legacy Joomla article about the King Arthur's Tools brand, still
      // indexed by search engines under a "/o-nas" alias unrelated to the
      // current About Us page. Redirect it to the matching brand card.
      {
        source: '/index.php/o-nas',
        destination: '/znacky#kingArthurUsa',
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin('./i18n.ts');
export default withNextIntl(nextConfig);