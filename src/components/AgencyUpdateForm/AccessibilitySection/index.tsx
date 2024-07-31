import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { DeepPartial, useForm } from 'react-hook-form';
import { convertToArray } from '@/utils/stringArrays';
import {
  AccessibilityFormData,
  AgencyUpdateFormData,
  zAccessibilityFormData,
} from '@/utils/types/agency-update-form';
import React, { useEffect } from 'react';
import { useBeforeUnload } from '@/utils/hooks/useBeforeUnload';
import { FormContext } from '../FormContext';

interface AccessibilitySectionProps {
  defaultValues?: DeepPartial<AccessibilityFormData>;
  setFormData?: React.Dispatch<React.SetStateAction<AgencyUpdateFormData>>;
}

export default function AccessibilitySection({
  defaultValues,
}: AccessibilitySectionProps) {
  const t = useTranslations('Form');

  const {
    register,
    watch,
    getValues,
    trigger,
    formState: { errors, isDirty },
  } = useForm<AccessibilityFormData>({
    resolver: zodResolver(zAccessibilityFormData),
    defaultValues,
  });

  useBeforeUnload(isDirty);
  const { registerNextMiddleware, stepDelta, updateFormData } =
    React.useContext(FormContext);

  const beforeNext = async () => {
    const output = await trigger(undefined, { shouldFocus: true });
    if (!output) return false;

    updateFormData(getValues());
    return true;
  };

  useEffect(() => {
    registerNextMiddleware('Step 2.1', beforeNext);
  }, []);

  return (
    <motion.div
      initial={{
        x: stepDelta >= 0 ? '50%' : '-50%',
        opacity: 0,
      }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Accessibility Subpage */}
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        {t('accessibility.title')}
      </h2>

      <section className="mt-10 flex flex-col gap-4">
        {/* Language Support */}
        <div>
          <p className="block text-sm font-medium leading-6 text-gray-900">
            {t('accessibility.languages.title')}
          </p>

          <div className="flex flex-col gap-8 md:flex-row">
            {/* ASL */}
            <div className="space-x-2">
              <input
                type="checkbox"
                id="languageSupport.asl"
                className="form-checkbox"
                {...register('languageSupport.asl')}
              />
              <label
                htmlFor="languageSupport.asl"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t('accessibility.languages.options.asl')}
              </label>
            </div>

            {/* Spanish */}
            <div className="space-x-2">
              <input
                type="checkbox"
                id="languageSupport.spanish"
                className="form-checkbox"
                {...register('languageSupport.spanish')}
              />
              <label
                htmlFor="languageSupport.spanish"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t('accessibility.languages.options.spanish')}
              </label>
            </div>

            {/* Tele-interpreter Service */}
            <div className="space-x-2">
              <input
                type="checkbox"
                id="languageSupport.teleinterpreterLanguageService"
                className="form-checkbox"
                {...register('languageSupport.teleinterpreterLanguageService')}
              />
              <label
                htmlFor="languageSupport.teleinterpreterLanguageService"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t('accessibility.languages.options.tele')}
              </label>
            </div>

            {/* Other */}
            <div>
              <div className="space-x-2">
                <input
                  type="checkbox"
                  id="languageSupport.other"
                  className="form-checkbox"
                  {...register('languageSupport.other.selected')}
                />
                <label
                  htmlFor="languageSupport.other"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t('accessibility.languages.options.other')}
                </label>
              </div>
            </div>
          </div>
          {watch('languageSupport.other.selected') && (
            <div className="mt-4">
              <input
                className="h-8 w-1/3 rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                placeholder="Please specify."
                {...register('languageSupport.other.content', {
                  setValueAs: (data) => convertToArray(data),
                })}
              />
              <div className="mt-4 min-h-6 ">
                {errors.languageSupport?.other?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.languageSupport.other.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Supported Languages Without Notice */}
        <div>
          <label
            htmlFor="supportedLanguagesWithoutNotice"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {t('accessibility.languages.priorNotice')}
          </label>
          <div className="mt-2">
            <textarea
              // type="text"
              id="supportedLanguagesWithoutNotice"
              {...register('supportedLanguagesWithoutNotice', {
                setValueAs: (data) => convertToArray(data),
              })}
              autoComplete="supportedLanguagesWithoutNotice"
              cols={30}
              rows={5}
              className="w-full resize-none rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            ></textarea>
          </div>
        </div>

        {/* Accessibility ADA */}
        <div className="flex flex-col gap-6 md:flex-row">
          <h2 className="block text-sm font-medium leading-6 text-gray-900">
            {t('accessibility.ada')}
          </h2>
          <div className="flex flex-row gap-4 whitespace-nowrap">
            <div>
              <input
                id="accessibilityADA1"
                type="radio"
                value=""
                {...register('accessibilityADA')}
                autoComplete="accessibilityADA"
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                defaultChecked
              />
              <label
                htmlFor="accessibilityADA1"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {t('options.no')}
              </label>
            </div>
            <div>
              <input
                id="accessibilityADA2"
                type="radio"
                value="true"
                {...register('accessibilityADA')}
                autoComplete="accessibilityADA"
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="accessibilityADA2"
                className="ms-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {t('options.yes')}
              </label>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
