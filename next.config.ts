import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eshop.marosko.sk',
        pathname: '/resize/**',
      },
    ],
  },
  // AI product feed for eshop.marosko.sk. BiznisWeb cannot host custom files,
  // so the feed is generated daily from the BiznisWeb API on the
  // rezbarskenaradie.sk server and served here under the marosko.sk brand.
  async rewrites() {
    return [
      {
        source: '/agent-feed.json',
        destination: 'https://www.rezbarskenaradie.sk/marosko/agent-feed.json',
      },
      // Czech (CZK) and Romanian (RON) versions of the same feed.
      {
        source: '/:lang(cz|ro)/agent-feed.json',
        destination: 'https://www.rezbarskenaradie.sk/marosko/:lang/agent-feed.json',
      },
    ];
  },
  async redirects() {
    return [
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