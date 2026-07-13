import { useTranslations } from 'next-intl';

export default function CategoriesPage() {
  const t = useTranslations('services');

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-amber-800 mb-6">{t('title')}</h1>
      <ul className="space-y-3 text-gray-700 text-lg">
        <li>✓ {t('item1')}</li>
        <li>✓ {t('item2')}</li>
        <li>✓ {t('item3')}</li>
        <li>✓ {t('item4')}</li>
        <li>✓ {t('item5')}</li>
      </ul>
    </div>
  );
}