import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="text-center py-12">
      <h1 className="text-6xl font-bold text-amber-800 mb-6">
        {t('title')}
      </h1>
      <p className="text-2xl text-gray-600 mb-8">
        {t('subtitle')}
      </p>
      <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
        {t('description')}
      </p>
    </div>
  );
}