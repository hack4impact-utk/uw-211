import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import PreliminariesHeader from '../../PreliminariesHeader';
import { DeepPartial, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AdditionalNumbers from '@/components/AdditionalNumbers';
import {
  PreliminariesGeneralFormData,
  zPreliminariesGeneralFormData,
} from '@/utils/types/agency-update-form';
import { useContext, useEffect } from 'react';
import { FormContext } from '@/components/AgencyUpdateForm/FormContext';

interface GeneralSubsectionProps {
  defaultValues?: DeepPartial<PreliminariesGeneralFormData>;
}

export default function PreliminariesSection({
  defaultValues,
}: GeneralSubsectionProps) {
  const t = useTranslations('Form');

  const { registerNextMiddleware, updateFormData, substepDelta } =
    useContext(FormContext);

  const {
    control,
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<PreliminariesGeneralFormData>({
    resolver: zodResolver(zPreliminariesGeneralFormData),
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
    registerNextMiddleware('Step 1.1', beforeNext);
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
      <PreliminariesHeader name={t('preliminaries.general.title')} />

      <section className="mt-10 flex w-full flex-col gap-4 lg:flex-row">
        {/* left section */}
        <section className="flex w-full flex-col lg:w-1/2">
          <div className="flex w-full flex-col gap-4 md:flex-row">
            {/* Legal Agency Name */}
            <div className="w-full sm:w-1/2 md:w-2/3">
              <label
                htmlFor="legalName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('preliminaries.general.name')}
                <span className="ml-1 text-sm text-red-400">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="legalName"
                  {...register('legalName')}
                  autoComplete="legalName"
                  className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
                <div className="mt-2 min-h-6 ">
                  {errors.legalName?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.legalName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Also known as */}
            <div className="w-full sm:w-1/2  md:w-1/3">
              <label
                htmlFor="akas"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('preliminaries.general.aka')}
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="akas"
                  {...register('akas')}
                  autoComplete="akas"
                  className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
                <div className="mt-2 min-h-6 ">
                  {errors.akas?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.akas.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 md:flex-row">
            {/* Legal organizational Status */}
            <div className="w-full sm:w-1/2 md:w-1/3">
              <label
                htmlFor="legalStatus"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('preliminaries.general.legalStatus.title')}
                <span className="ml-1 text-sm text-red-400">*</span>
              </label>
              <div className="mt-2">
                <select
                  id="legalStatus"
                  v-model="legalStatus"
                  {...register('legalStatus')}
                  autoComplete="legalStatus"
                  className="block h-8 w-full rounded-md border-0 bg-inherit p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                >
                  <option value="">
                    {t('preliminaries.general.legalStatus.options.empty')}
                  </option>
                  <option value="Federal">
                    {t('preliminaries.general.legalStatus.options.federal')}
                  </option>
                  <option value="State">
                    {t('preliminaries.general.legalStatus.options.state')}
                  </option>
                  <option value="County">
                    {t('preliminaries.general.legalStatus.options.county')}
                  </option>
                  <option value="City">
                    {t('preliminaries.general.legalStatus.options.city')}
                  </option>
                  <option value="Non-profit">
                    {t('preliminaries.general.legalStatus.options.nonprofit')}
                  </option>
                  <option value="501(c)3">
                    {t('preliminaries.general.legalStatus.options.501c3')}
                  </option>
                  <option value="Faith-based">
                    {t('preliminaries.general.legalStatus.options.faith')}
                  </option>
                  <option value="For profit">
                    {t('preliminaries.general.legalStatus.options.profit')}
                  </option>
                  <option value="Other">
                    {t('preliminaries.general.legalStatus.options.other')}
                  </option>
                </select>
                <div className="mt-2 min-h-6 ">
                  {errors.legalStatus?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.legalStatus.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Director Name/Title */}
            <div className="w-full sm:w-1/2 md:w-2/3">
              <label
                htmlFor="directorName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('preliminaries.general.director')}
                <span className="ml-1 text-sm text-red-400">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="directorName"
                  {...register('directorName')}
                  autoComplete="directorName"
                  className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
                <div className="mt-2 min-h-6 ">
                  {errors.directorName?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.directorName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Brief Agency Information */}
          <div>
            <label
              htmlFor="agencyInfo"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {t('preliminaries.general.agencyInfo')}
              <span className="ml-1 text-sm text-red-400">*</span>
            </label>
            <div className="mt-2">
              <textarea
                id="agencyInfo"
                v-model="agencyInfo"
                {...register('agencyInfo')}
                autoComplete="agencyInfo"
                className="block h-36 w-full resize-none rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
              <div className="mt-2 min-h-6 ">
                {errors.agencyInfo?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.agencyInfo.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* right section */}
        <section className="flex w-full flex-col lg:w-1/2">
          {/* Contact Information */}
          <section>
            <div className="flex w-full flex-col gap-4 md:flex-row">
              {/* contactInfo.phoneNumber */}
              <div className="w-full md:w-1/2">
                <label
                  htmlFor="contactInfo.phoneNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {t('preliminaries.general.phone')}
                  <span className="ml-1 text-sm text-red-400">*</span>
                </label>

                <div className="mt-2">
                  <input
                    type="tel"
                    id="contactInfo.phoneNumber"
                    v-model="contactInfo.phoneNumber"
                    {...register('contactInfo.phoneNumber')}
                    autoComplete="contactInfo.phoneNumber"
                    className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />

                  <div className="mt-2 min-h-6 ">
                    {errors.contactInfo?.phoneNumber?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.contactInfo?.phoneNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* contactInfo.faxNumber */}
              <div className="w-full md:w-1/2">
                <label
                  htmlFor="contactInfo.faxNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {t('preliminaries.general.fax')}
                  <span className="ml-1 text-sm text-red-400">*</span>
                </label>

                <div className="mt-2">
                  <input
                    type="tel"
                    id="contactInfo.faxNumber"
                    v-model="contactInfo.faxNumber"
                    {...register('contactInfo.faxNumber')}
                    autoComplete="contactInfo.faxNumber"
                    className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />

                  <div className="mt-2 min-h-6 ">
                    {errors.contactInfo?.faxNumber?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.contactInfo?.faxNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-4 md:flex-row">
              {/* contactInfo.tollFreeNumber */}
              <div className="w-full md:w-1/3">
                <label
                  htmlFor="contactInfo.tollFreeNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {t('preliminaries.general.tollFree')}
                  <span className="ml-1 text-sm text-red-400">*</span>
                </label>

                <div className="mt-2">
                  <input
                    type="tel"
                    id="contactInfo.tollFreeNumber"
                    v-model="contactInfo.tollFreeNumber"
                    {...register('contactInfo.tollFreeNumber')}
                    autoComplete="contactInfo.tollFreeNumber"
                    className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />

                  <div className="mt-2 min-h-6 ">
                    {errors.contactInfo?.tollFreeNumber?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.contactInfo?.tollFreeNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* contactInfo.TDDTTYNumber */}
              <div className="w-full md:w-2/3">
                <label
                  htmlFor="contactInfo.TDDTTYNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {t('preliminaries.general.tddTty')}
                  <span className="ml-1 text-sm text-red-400">*</span>
                </label>
                <div className="mt-2">
                  <input
                    type="tel"
                    id="contactInfo.TDDTTYNumber"
                    v-model="contactInfo.TDDTTYNumber"
                    {...register('contactInfo.TDDTTYNumber')}
                    autoComplete="contactInfo.TDDTTYNumber"
                    className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />

                  <div className="mt-2 min-h-6 ">
                    {errors.contactInfo?.TDDTTYNumber?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.contactInfo?.TDDTTYNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <AdditionalNumbers
              name="contactInfo.additionalNumbers"
              control={control}
            />

            {/* contactInfo.email */}
            <div>
              <label
                htmlFor="contactInfo.email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('preliminaries.general.email')}
                <span className="ml-1 text-sm text-red-400">*</span>
              </label>

              <div className="mt-2">
                <input
                  type="email"
                  id="contactInfo.email"
                  v-model="contactInfo.email"
                  {...register('contactInfo.email')}
                  autoComplete="contactInfo.email"
                  className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                />

                <div className="mt-2 min-h-6 ">
                  {errors.contactInfo?.email?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.contactInfo?.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* contactInfo.website */}
            <div>
              <label
                htmlFor="contactInfo.website"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('preliminaries.general.website')}
                <span className="ml-1 text-sm text-red-400">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="contactInfo.website"
                  v-model="contactInfo.website"
                  {...register('contactInfo.website')}
                  autoComplete="contactInfo.website"
                  className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                />

                <div className="mt-2 min-h-6 ">
                  {errors.contactInfo?.website?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.contactInfo?.website.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </section>
      </section>
    </motion.div>
  );
}
