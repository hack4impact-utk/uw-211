import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import PreliminariesHeader from '../../PreliminariesHeader';
import { convertToArray } from '@/utils/stringArrays';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeepPartial, useForm } from 'react-hook-form';
import {
  PreliminariesAdditionalFormData,
  zPreliminariesAdditionalFormData,
} from '@/utils/types/agency-update-form';
import { useContext, useEffect } from 'react';
import { FormContext } from '@/components/AgencyUpdateForm/FormContext';

interface AdditionalSubsectionProps {
  defaultValues?: DeepPartial<PreliminariesAdditionalFormData>;
}

export default function AdditionalSubsection({
  defaultValues,
}: AdditionalSubsectionProps) {
  const t = useTranslations('Form');
  const { registerNextMiddleware, updateFormData, substepDelta } =
    useContext(FormContext);

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<PreliminariesAdditionalFormData>({
    resolver: zodResolver(zPreliminariesAdditionalFormData),
    defaultValues,
  });

  const beforeNext = async () => {
    const output = await trigger(undefined, {
      shouldFocus: true,
    });
    if (!output) return false;

    updateFormData(getValues());
    return true;
  };

  useEffect(() => {
    registerNextMiddleware('Step 1.3', beforeNext);
  }, []);

  return (
    <motion.div
      initial={{
        x: substepDelta >= 0 ? '50%' : '-50%',
        opacity: 0,
      }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <PreliminariesHeader name={t('preliminaries.additional.title')} />

      <section className="mt-10 flex w-full flex-col gap-4 md:flex-row">
        {/* Left */}
        <section className="w-full md:w-1/2">
          {/* Service Area */}
          <div>
            <div className="mb-4">
              <h3 className="block text-sm font-medium leading-6 text-gray-900">
                {t('preliminaries.additional.serviceArea.title')}
                <span className="ml-1 text-sm text-red-400">*</span>
              </h3>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                {t('preliminaries.additional.serviceArea.description')}
              </p>
            </div>

            <div className="flex flex-col gap-8">
              {/* serviceArea.townCity */}
              <div>
                <label
                  htmlFor="serviceArea.townCity"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {t('preliminaries.additional.serviceArea.townCity')}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="serviceArea.townCity"
                    {...register('serviceArea.townCity')}
                    autoComplete="serviceArea.townCity"
                    className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* serviceArea.zipCodes */}
              <div>
                <label
                  htmlFor="serviceArea.zipCodes"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {t('preliminaries.additional.serviceArea.zip')}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="serviceArea.zipCodes"
                    {...register('serviceArea.zipCodes', {
                      setValueAs: (data) => convertToArray(data),
                    })}
                    autoComplete="serviceArea.zipCodes"
                    className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* serviceArea.counties */}
              <div>
                <label
                  htmlFor="serviceArea.counties"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {t('preliminaries.additional.serviceArea.county')}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="serviceArea.counties"
                    {...register('serviceArea.counties', {
                      setValueAs: (data) => convertToArray(data),
                    })}
                    autoComplete="serviceArea.zipCodes"
                    className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Region */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex flex-row gap-4">
                  {/* serviceArea.statewide */}
                  <div className="space-x-2">
                    <input
                      type="checkbox"
                      id="serviceArea.statewide"
                      className="form-checkbox"
                      {...register('serviceArea.statewide')}
                    />
                    <label
                      htmlFor="serviceArea.statewide"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t('preliminaries.additional.serviceArea.state')}
                    </label>
                  </div>

                  {/* serviceArea.nationwide */}
                  <div className="space-x-2">
                    <input
                      type="checkbox"
                      id="serviceArea.nationwide"
                      className="form-checkbox"
                      {...register('serviceArea.nationwide')}
                    />
                    <label
                      htmlFor="serviceArea.nationwide"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t('preliminaries.additional.serviceArea.nation')}
                    </label>
                  </div>
                </div>

                {/* other */}
                <div className="flex flex-row items-center gap-4">
                  <label
                    htmlFor="serviceArea.other"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {t('preliminaries.additional.serviceArea.other')}
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="serviceArea.other"
                      {...register('serviceArea.other')}
                      autoComplete="serviceArea.other"
                      className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Error */}
            <div className="mt-4 min-h-6 ">
              {errors.serviceArea?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.serviceArea.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Right */}
        <section className="w-full md:w-1/2">
          {/* Annual Agency Update */}
          <div>
            <div className="mb-4">
              <h3 className="block text-sm font-medium leading-6 text-gray-900">
                {t('preliminaries.additional.agencyUpdate.title')}
              </h3>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                {t('preliminaries.additional.agencyUpdate.description')}
              </p>
            </div>

            <div className="flex flex-row gap-2 md:gap-4">
              {/* annualAgencyUpdate.name */}
              <div className="w-2/3">
                <label
                  htmlFor="annualAgencyUpdate.name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {t('preliminaries.additional.agencyUpdate.name')}
                  <span className="ml-1 text-sm text-red-400">*</span>
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="annualAgencyUpdate.name"
                    {...register('annualAgencyUpdate.name')}
                    autoComplete="annualAgencyUpdate.name"
                    className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="mt-2 min-h-6 ">
                  {errors.annualAgencyUpdate?.name?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.annualAgencyUpdate.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* annualAgencyUpdate.title */}
              <div className="w-1/3">
                <label
                  htmlFor="annualAgencyUpdate.title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {t('preliminaries.additional.agencyUpdate.contactTitle')}
                  <span className="ml-1 text-sm text-red-400">*</span>
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="annualAgencyUpdate.title"
                    {...register('annualAgencyUpdate.title')}
                    autoComplete="annualAgencyUpdate.title"
                    className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="mt-2 min-h-6 ">
                  {errors.annualAgencyUpdate?.title?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.annualAgencyUpdate.title.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* annualAgencyUpdate.phoneNumber */}
            <div>
              <label
                htmlFor="annualAgencyUpdate.phoneNumber"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('preliminaries.additional.agencyUpdate.phone')}
                <span className="ml-1 text-sm text-red-400">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="annualAgencyUpdate.phoneNumber"
                  {...register('annualAgencyUpdate.phoneNumber')}
                  autoComplete="annualAgencyUpdate.phoneNumber"
                  className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="mt-2 min-h-6 ">
                {errors.annualAgencyUpdate?.phoneNumber?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.annualAgencyUpdate.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* annualAgencyUpdate.email */}
            <div>
              <label
                htmlFor="annualAgencyUpdate.email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('preliminaries.additional.agencyUpdate.email')}
                <span className="ml-1 text-sm text-red-400">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="annualAgencyUpdate.email"
                  {...register('annualAgencyUpdate.email')}
                  autoComplete="annualAgencyUpdate.email"
                  className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div className="mt-2 min-h-6 ">
                {errors.annualAgencyUpdate?.email?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.annualAgencyUpdate.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* annualAgencyUpdate.hideFromWebsite */}
            <div className="flex flex-col gap-6 md:flex-row">
              <h2 className="block text-sm font-medium leading-6 text-gray-900">
                {t('preliminaries.additional.agencyUpdate.confidential')}
                <span className="ml-1 text-sm text-red-400">*</span>
              </h2>
              <div className="flex flex-row gap-4 whitespace-nowrap">
                <div>
                  <input
                    id="annualAgencyUpdate.hideFromWebsite1"
                    type="radio"
                    value=""
                    {...register('annualAgencyUpdate.hideFromWebsite')}
                    autoComplete="annualAgencyUpdate.hideFromWebsite"
                    className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    defaultChecked
                  />
                  <label
                    htmlFor="annualAgencyUpdate.hideFromWebsite1"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {t('options.no')}
                  </label>
                </div>
                <div>
                  <input
                    id="annualAgencyUpdate.hideFromWebsite2"
                    type="radio"
                    value="true"
                    {...register('annualAgencyUpdate.hideFromWebsite')}
                    autoComplete="annualAgencyUpdate.hideFromWebsite"
                    className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="annualAgencyUpdate.hideFromWebsite2"
                    className="ms-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {t('options.yes')}
                  </label>
                </div>
              </div>
            </div>

            {/* errors */}
            <div className="mt-2 min-h-6 ">
              {errors.annualAgencyUpdate?.hideFromWebsite?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.annualAgencyUpdate.hideFromWebsite.message}
                </p>
              )}
            </div>
          </div>
        </section>
      </section>
    </motion.div>
  );
}
