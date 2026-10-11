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
    ];
  },
  async redirects() {
    return [
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