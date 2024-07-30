import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import PreliminariesHeader from '../../PreliminariesHeader';
import Hours from '@/components/Hours';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeepPartial, useForm } from 'react-hook-form';
import {
  PreliminariesOperationsFormData,
  zPreliminariesOperationsFormData,
} from '@/utils/types/agency-update-form';
import { useContext, useEffect } from 'react';
import { FormContext } from '@/components/AgencyUpdateForm/FormContext';

interface OperationsSubsectionProps {
  defaultValues?: DeepPartial<PreliminariesOperationsFormData>;
}

export default function OperationsSubsection({
  defaultValues,
}: OperationsSubsectionProps) {
  const t = useTranslations('Form');
  const { substepDelta, registerNextMiddleware, updateFormData } =
    useContext(FormContext);

  const {
    control,
    register,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<PreliminariesOperationsFormData>({
    resolver: zodResolver(zPreliminariesOperationsFormData),
    defaultValues,
  });

  console.log(defaultValues?.location?.confidential);

  const beforeNext = async () => {
    const output = await trigger(undefined, {
      shouldFocus: true,
    });
    if (!output) return false;

    updateFormData(getValues());
    return true;
  };

  useEffect(() => {
    registerNextMiddleware('Step 1.2', beforeNext);
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
      <PreliminariesHeader name={t('preliminaries.operations.title')} />

      <section className="mt-10 flex flex-col md:flex-row">
        {/* Left */}
        <section className="flex w-full flex-col md:w-1/2">
          {/* Hours of Operation */}
          <div>
            <h3 className="block text-sm font-medium leading-6 text-gray-900">
              {t('preliminaries.operations.hours')}
            </h3>
            <div className="mr-10">
              <Hours name="hours" control={control} />
            </div>
          </div>

          {/* Funding Sources */}
          <div className="mt-8">
            <h3 className="mb-2 block text-sm font-medium leading-6 text-gray-900">
              {t('preliminaries.operations.funding.title')}
              <span className="ml-1 text-sm text-red-400">*</span>
            </h3>

            <div className="flex w-full flex-col md:w-2/3 md:flex-row">
              {/* left column */}
              <section className="w-full md:w-1/2">
                {/* Federal */}
                <div className="space-x-2">
                  <input
                    type="checkbox"
                    id="fundingSources.federal"
                    className="form-checkbox"
                    {...register('fundingSources.federal')}
                  />
                  <label
                    htmlFor="fundingSources.federal"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('preliminaries.operations.funding.options.federal')}
                  </label>
                </div>

                {/* State */}
                <div className="space-x-2">
                  <input
                    type="checkbox"
                    id="fundingSources.state"
                    className="form-checkbox"
                    {...register('fundingSources.state')}
                  />
                  <label
                    htmlFor="fundingSources.state"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('preliminaries.operations.funding.options.state')}
                  </label>
                </div>

                {/* County */}
                <div className="space-x-2">
                  <input
                    type="checkbox"
                    id="fundingSources.county"
                    className="form-checkbox"
                    {...register('fundingSources.county')}
                  />
                  <label
                    htmlFor="fundingSources.county"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('preliminaries.operations.funding.options.county')}
                  </label>
                </div>

                {/* City */}
                <div className="space-x-2">
                  <input
                    type="checkbox"
                    id="fundingSources.city"
                    className="form-checkbox"
                    {...register('fundingSources.city')}
                  />
                  <label
                    htmlFor="fundingSources.city"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('preliminaries.operations.funding.options.city')}
                  </label>
                </div>

                {/* Donations */}
                <div className="space-x-2">
                  <input
                    type="checkbox"
                    id="fundingSources.donations"
                    className="form-checkbox"
                    {...register('fundingSources.donations')}
                  />
                  <label
                    htmlFor="fundingSources.donations"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('preliminaries.operations.funding.options.donations')}
                  </label>
                </div>
              </section>

              {/* right column */}
              <section className="w-full md:w-1/2">
                {/* Foundations/Private Org */}
                <div className="space-x-2">
                  <input
                    type="checkbox"
                    id="fundingSources.foundations"
                    className="form-checkbox"
                    {...register('fundingSources.foundations')}
                  />
                  <label
                    htmlFor="fundingSources.foundations"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('preliminaries.operations.funding.options.foundations')}
                  </label>
                </div>

                {/* Fees/Dues */}
                <div className="space-x-2">
                  <input
                    type="checkbox"
                    id="fundingSources.feesDues"
                    className="form-checkbox"
                    {...register('fundingSources.feesDues')}
                  />
                  <label
                    htmlFor="fundingSources.feesDues"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('preliminaries.operations.funding.options.fees')}
                  </label>
                </div>

                {/* United Way */}
                <div className="space-x-2">
                  <input
                    type="checkbox"
                    id="fundingSources.unitedWay"
                    className="form-checkbox"
                    {...register('fundingSources.unitedWay')}
                  />
                  <label
                    htmlFor="fundingSources.unitedWay"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('preliminaries.operations.funding.options.unitedWay')}
                  </label>
                </div>

                {/* Other */}
                <div className="space-x-2">
                  <input
                    type="checkbox"
                    id="fundingSources.other"
                    className="form-checkbox"
                    {...register('fundingSources.other.selected')}
                  />
                  <label
                    htmlFor="fundingSources.other"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('preliminaries.operations.funding.options.other')}
                  </label>
                  {watch('fundingSources.other.selected') ? (
                    <>
                      <Input
                        className="m-2"
                        placeholder="Please specify."
                        {...register('fundingSources.other.content')}
                      />
                      <div className="mt-2 min-h-6 ">
                        {errors.fundingSources?.other?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.fundingSources.other.message}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </section>
            </div>

            {/* Error Message */}
            <div className="mt-2 min-h-6 ">
              {errors.fundingSources?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.fundingSources.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Right */}
        <section className="w-full md:w-1/2">
          {/* Location */}
          <div>
            <h3 className="mb-2 block text-sm font-medium leading-6 text-gray-900">
              {t('preliminaries.operations.location.title')}
            </h3>
            {/* location.confidential */}
            <div>
              <h2 className="block text-sm font-medium leading-6 text-gray-900">
                {t('preliminaries.operations.location.confidential')}
                <span className="ml-1 text-sm text-red-400">*</span>
              </h2>
              <div className="flex flex-row gap-4 whitespace-nowrap">
                <div>
                  <input
                    id="location.confidential1"
                    type="radio"
                    value="false"
                    {...register('location.confidential', {
                      setValueAs: (v) => !(v === 'false'),
                    })}
                    autoComplete="location.confidential"
                    className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    defaultChecked
                  />
                  <label
                    htmlFor="location.confidential1"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {t('options.no')}
                  </label>
                </div>
                <div>
                  <input
                    id="location.confidential2"
                    type="radio"
                    value="true"
                    {...register('location.confidential', {
                      setValueAs: (v) => v === 'true',
                    })}
                    autoComplete="location.confidential"
                    className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="location.confidential2"
                    className="ms-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {t('options.yes')}
                  </label>
                </div>
              </div>
              <div className="mt-2 min-h-6 ">
                {errors.location?.confidential?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.location.confidential.message}
                  </p>
                )}
              </div>
            </div>

            {/* location.physicalAddress */}
            <div className="w-full">
              <label
                htmlFor="location.physicalAddress"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('preliminaries.operations.location.address.physical')}
                <span className="ml-1 text-sm text-red-400">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="location.physicalAddress"
                  {...register('location.physicalAddress')}
                  autoComplete="location.physicalAddress"
                  className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
                <div className="mt-2 min-h-6 ">
                  {errors.location?.physicalAddress?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.location.physicalAddress.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* location.mailingAddress */}
            <div className="w-full">
              <label
                htmlFor="location.mailingAddress"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('preliminaries.operations.location.address.mailing')}
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="location.mailingAddress"
                  {...register('location.mailingAddress')}
                  autoComplete="location.mailingAddress"
                  className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
                <div className="mt-2 min-h-6 ">
                  {errors.location?.mailingAddress?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.location.mailingAddress.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* location.county */}
            <div className="w-full">
              <label
                htmlFor="location.county"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {t('preliminaries.operations.location.address.county')}
                <span className="ml-1 text-sm text-red-400">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="location.county"
                  {...register('location.county')}
                  autoComplete="location.county"
                  className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
                <div className="mt-2 min-h-6 ">
                  {errors.location?.county?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.location.county.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:gap-4">
              {/* location.city */}
              <div className="w-full sm:w-1/2 md:w-3/6">
                <label
                  htmlFor="location.city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {t('preliminaries.operations.location.address.city')}
                  <span className="ml-1 text-sm text-red-400">*</span>
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="location.city"
                    {...register('location.city')}
                    autoComplete="location.city"
                    className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  <div className="mt-2 min-h-6 ">
                    {errors.location?.city?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.location.city.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* location.state */}
              <div className="w-full sm:w-1/2 md:w-1/6">
                <label
                  htmlFor="location.state"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {t('preliminaries.operations.location.address.state')}
                  <span className="ml-1 text-sm text-red-400">*</span>
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="location.state"
                    {...register('location.state')}
                    autoComplete="location.state"
                    className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  <div className="mt-2 min-h-6 ">
                    {errors.location?.state?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.location.state.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* location.zipCode */}
              <div className="w-full sm:w-1/2 md:w-2/6">
                <label
                  htmlFor="location.zipCode"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {t('preliminaries.operations.location.address.zip')}
                  <span className="ml-1 text-sm text-red-400">*</span>
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="location.zipCode"
                    {...register('location.zipCode')}
                    autoComplete="location.zipCode"
                    className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  <div className="mt-2 min-h-6 ">
                    {errors.location?.zipCode?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.location.zipCode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </motion.div>
  );
}
