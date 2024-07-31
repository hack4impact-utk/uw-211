import { convertToString } from '@/utils/stringArrays';
import { AccessibilityFormData } from '@/utils/types/agency-update-form';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface ReviewAccessibilitySectionProps {
  formData: AccessibilityFormData;
}

export default function ReviewAccessibilitySection({
  formData,
}: ReviewAccessibilitySectionProps) {
  const t = useTranslations('Form');

  const accessibilityLangs = useMemo(() => {
    const language = formData.languageSupport;
    let result = '';

    if (language.asl) result += t('accessibility.languages.options.asl') + ', ';
    if (language.spanish)
      result += t('accessibility.languages.options.spanish') + ', ';
    if (language.teleinterpreterLanguageService)
      result += t('accessibility.languages.options.tele') + ', ';
    if (language.other?.selected) {
      result += convertToString(language.other.content!);
      result += ', ';
    }

    if (result === '') return 'None';
    else return result.substring(0, result.length - 2);
  }, [formData.languageSupport, t]);

  return (
    <section>
      <h2 className="mb-4 text-base font-semibold leading-7 text-gray-900 underline underline-offset-2">
        {t('accessibility.title')}
      </h2>

      <div className="flex flex-col gap-4">
        <div>
          <p className="w-full text-base font-semibold leading-7 text-gray-900">
            {t('accessibility.languages.title')}
          </p>
          <p>{accessibilityLangs}</p>
        </div>

        <div>
          <p className="w-full text-base font-semibold leading-7 text-gray-900">
            {t('accessibility.languages.priorNotice')}
          </p>
          <p>
            {formData.supportedLanguagesWithoutNotice.length != 0
              ? convertToString(formData.supportedLanguagesWithoutNotice)
              : 'No'}
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <p className="text-base font-semibold leading-7 text-gray-900">
            {t('accessibility.ada')}
          </p>
          <p>
            {formData.accessibilityADA.toString() === 'true'
              ? t('options.yes')
              : t('options.no')}
          </p>
        </div>
      </div>
    </section>
  );
}
