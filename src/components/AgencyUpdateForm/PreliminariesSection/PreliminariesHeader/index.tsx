import { useTranslations } from 'next-intl';

interface PreliminariesHeaderProps {
  name: string;
}

export default function PreliminariesHeader({
  name,
}: PreliminariesHeaderProps) {
  const t = useTranslations('Form');

  return (
    <>
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        {t('preliminaries.title')} - {name}
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        {t('preliminaries.description')}
      </p>
    </>
  );
}
