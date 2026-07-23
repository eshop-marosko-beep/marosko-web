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