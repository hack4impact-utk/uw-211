import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { DeepPartial, useForm } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import {
  OpportunitiesFormData,
  zOpportunitiesFormData,
} from '@/utils/types/agency-update-form';
import { FormContext } from '../FormContext';

interface OpportunitiesSectionProps {
  defaultValues?: DeepPartial<OpportunitiesFormData>;
}

export default function OpportunitiesSection({
  defaultValues,
}: OpportunitiesSectionProps) {
  const t = useTranslations('Form');
  const [volunteerChecked, setVolunteerChecked] = useState('false'); // TODO: investigate if we need this state
  const [donationChecked, setDonationChecked] = useState('false'); // TODO: investigate if we need this state
  const [pickupChecked, setPickupChecked] = useState('false'); // TODO: investigate if we need this state
  const [recommendationChecked, setRecommendationChecked] = useState('false'); // TODO: investigate if we need this state

  const { registerNextMiddleware, updateFormData, stepDelta } =
    useContext(FormContext);

  const {
    register,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<OpportunitiesFormData>({
    resolver: zodResolver(zOpportunitiesFormData),
    defaultValues,
  });

  const beforeNext = async () => {
    const output = await trigger(undefined, { shouldFocus: true });
    if (!output) return false;

    updateFormData(getValues());
    return true;
  };

  useEffect(() => {
    registerNextMiddleware('Step 4.1', beforeNext);
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
      <div className="flex flex-col gap-6">
        {/* top container */}
        <div className="flex h-full w-full flex-col gap-8 lg:flex-row">
          {/* left section */}
          <section className="h-2/3 w-full lg:w-1/2">
            <div className="mb-2 flex flex-col">
              <div className="flex flex-col lg:flex-row lg:gap-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  {t('opportunities.acceptVolunteers.title')}
                  <span className="ml-1 text-sm text-red-400">*</span>
                </h2>
                {/* radio button */}
                <div className="flex flex-row gap-4 whitespace-nowrap">
                  <div>
                    <input
                      id="volunteers1"
                      type="radio"
                      value="false"
                      {...register('volunteerFields.volunteers')}
                      onChange={(e) => {
                        setVolunteerChecked(e.target.value);
                      }}
                      autoComplete="volunteers"
                      className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      defaultChecked
                    />
                    <label
                      htmlFor="volunteers1"
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {t('options.no')}
                    </label>
                  </div>
                  <div>
                    <input
                      id="volunteers2"
                      type="radio"
                      value="true"
                      {...register('volunteerFields.volunteers')}
                      onChange={(e) => {
                        setVolunteerChecked(e.target.value);
                      }}
                      autoComplete="volunteers"
                      className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <label
                      htmlFor=""
                      className="ms-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {t('options.yes')}
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-2 min-h-6 ">
                {errors.volunteerFields?.volunteers?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.volunteerFields.volunteers.message}
                  </p>
                )}
              </div>
            </div>

            <section
              className={`w-full, ${
                volunteerChecked === 'false' ? 'opacity-50' : ''
              }`}
            >
              <div className="mb-4">
                <label
                  htmlFor="vol_reqs"
                  className="text-base font-semibold leading-7 text-gray-900"
                >
                  {t('opportunities.acceptVolunteers.eligibility.title')}
                </label>
                <textarea
                  id="vol_reqs"
                  {...register('volunteerFields.vol_reqs')}
                  autoComplete="vol_reqs"
                  cols={30}
                  rows={10}
                  disabled={volunteerChecked === 'false'}
                  placeholder={t(
                    'opportunities.acceptVolunteers.eligibility.description'
                  )}
                  className="mt-2 block h-36 w-full resize-none rounded-lg border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                ></textarea>
                <div className="mt-2 min-h-6 ">
                  {errors.volunteerFields?.vol_reqs?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.volunteerFields.vol_reqs.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex w-full flex-col gap-6 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="vol_cor"
                    className="text-base font-semibold leading-7 text-gray-900"
                  >
                    {t(
                      'opportunities.acceptVolunteers.eligibility.coordinator'
                    )}
                  </label>

                  <input
                    type="text"
                    id="vol_coor"
                    {...register('volunteerFields.vol_coor')}
                    autoComplete="vol_coor"
                    disabled={volunteerChecked === 'false'}
                    className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  <div className="mt-2 min-h-6 ">
                    {errors.volunteerFields?.vol_coor?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.volunteerFields?.vol_coor.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="vol_coor_tel"
                    className="text-base font-semibold leading-7 text-gray-900"
                  >
                    {t('opportunities.acceptVolunteers.eligibility.phone')}
                  </label>

                  <input
                    type="tel"
                    id="vol_coor_tel"
                    {...register('volunteerFields.vol_coor_tel')}
                    autoComplete="vol_coor_tel"
                    disabled={volunteerChecked === 'false'}
                    className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  <div className="mt-2 min-h-6 ">
                    {errors.volunteerFields?.vol_coor_tel?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.volunteerFields.vol_coor_tel.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </section>

          {/* right section */}
          <section className="h-2/3 w-full lg:w-1/2">
            <div className="mb-2 flex flex-col">
              <div className="flex flex-col gap-4 lg:flex-row">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  {t('opportunities.acceptDonations.title')}
                  <span className="ml-1 text-sm text-red-400">*</span>
                </h2>
                {/* radio button */}
                <div className="flex flex-row gap-4 whitespace-nowrap">
                  <div>
                    <input
                      id="donation1"
                      type="radio"
                      value="false"
                      {...register('donationFields.donation')}
                      onChange={(e) => {
                        // clear out donation fields if no
                        setDonationChecked(e.target.value);
                        setPickupChecked('false');
                        setValue('donationFields.don_coor', undefined);
                        setValue('donationFields.don_coor_tel', undefined);
                        setValue('donationFields.donation', 'false');
                        setValue('donationFields.pickup', 'false');
                        setValue('donationFields.pickup_loc', undefined);
                        setValue('donationFields.don_ex', undefined);
                      }}
                      className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      defaultChecked
                    />
                    <label
                      htmlFor="donation1"
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {t('options.no')}
                    </label>
                  </div>
                  <div>
                    <input
                      id="donation2"
                      type="radio"
                      value="true"
                      {...register('donationFields.donation')}
                      onChange={(e) => {
                        setDonationChecked(e.target.value);
                      }}
                      className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="donation2"
                      className="ms-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {t('options.yes')}
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-2 min-h-6 ">
                {errors.donationFields?.donation?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.donationFields.donation.message}
                  </p>
                )}
              </div>
            </div>

            <section
              className={`${donationChecked === 'false' ? 'opacity-50' : ''}`}
            >
              <div className="mb-2">
                <div className="flex flex-col items-start lg:flex-row lg:items-center lg:gap-8">
                  <label
                    htmlFor="don_ex"
                    className="text-base font-semibold leading-7 text-gray-900"
                  >
                    {t('opportunities.acceptDonations.list.title')}
                  </label>
                  <input
                    type="text"
                    {...register('donationFields.don_ex')}
                    id="don_ex"
                    placeholder={t(
                      'opportunities.acceptDonations.list.description'
                    )}
                    disabled={donationChecked === 'false'}
                    className="mt-2 block h-8 w-full resize-none rounded-lg border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600  sm:text-sm sm:leading-6 lg:w-2/3"
                  ></input>
                </div>
                <div className="mt-2 min-h-6 ">
                  {errors.donationFields?.don_ex?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.donationFields.don_ex.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-row gap-6">
                {/* radio button */}
                <div className="mb-1 flex flex-col gap-4 sm:flex-row sm:gap-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    {t('opportunities.acceptDonations.pickup.title')}
                  </h2>
                  <div className="flex flex-row gap-4 whitespace-nowrap">
                    <div>
                      <input
                        id="pickup1"
                        type="radio"
                        value="false"
                        disabled={donationChecked === 'false'}
                        {...register('donationFields.pickup')}
                        onChange={(e) => {
                          setPickupChecked(e.target.value);
                        }}
                        className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        defaultChecked
                      />
                      <label
                        htmlFor="pickup1"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {t('options.no')}
                      </label>
                    </div>
                    <div>
                      <input
                        id="pickup2"
                        type="radio"
                        value="true"
                        disabled={donationChecked === 'false'}
                        {...register('donationFields.pickup')}
                        onChange={(e) => {
                          setPickupChecked(e.target.value);
                        }}
                        className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="pickup2"
                        className="ms-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {t('options.yes')}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 min-h-6 ">
                {errors.donationFields?.pickup?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.donationFields.pickup.message}
                  </p>
                )}
              </div>

              {/* pick up service */}
              <section
                className={`${pickupChecked === 'false' ? 'opacity-50' : ''}`}
              >
                <div className="">
                  <div className="flex flex-row items-center gap-4">
                    <label
                      htmlFor="pickup_loc"
                      className="text-base font-semibold leading-7 text-gray-900"
                    >
                      {t('opportunities.acceptDonations.pickup.where')}
                    </label>
                    <input
                      type="text"
                      {...register('donationFields.pickup_loc')}
                      id="pickup_loc"
                      disabled={pickupChecked === 'false'}
                      className="mt-2 block h-8 w-full resize-none rounded-lg border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                    ></input>
                  </div>
                  <div className="mt-2 min-h-6 ">
                    {errors.donationFields?.pickup_loc?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.donationFields?.pickup_loc.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <div className="flex w-full flex-col gap-6 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="don_coor"
                    className="text-base font-semibold leading-7 text-gray-900"
                  >
                    {t('opportunities.acceptDonations.coordinator')}
                  </label>

                  <input
                    type="text"
                    {...register('donationFields.don_coor')}
                    id="don_coor"
                    disabled={donationChecked === 'false'}
                    className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  <div className="mt-2 min-h-6 ">
                    {errors.donationFields?.don_coor?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.donationFields.don_coor.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="don_coor_tel"
                    className="text-base font-semibold leading-7 text-gray-900"
                  >
                    {t('opportunities.acceptDonations.phone')}
                  </label>

                  <input
                    type="tel"
                    {...register('donationFields.don_coor_tel')}
                    id="don_coor_tel"
                    disabled={donationChecked === 'false'}
                    className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  <div className="mt-2 min-h-6 ">
                    {errors.donationFields?.don_coor_tel?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.donationFields.don_coor_tel.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </section>
        </div>

        {/* bottom container */}
        <div className="flex h-full w-full flex-col lg:flex-row">
          <section className="h-full w-full">
            <div className="mb-4 flex flex-col">
              <div className="flex flex-col gap-4 lg:flex-row lg:gap-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  {t('opportunities.other.title')}
                  <span className="ml-1 text-sm text-red-400">*</span>
                </h2>
                {/* radio button */}
                <div className="flex flex-row gap-4 whitespace-nowrap">
                  <div>
                    <input
                      id="recommendation"
                      type="radio"
                      value="false"
                      {...register('recommendationFields.recommendation')}
                      onChange={(e) => {
                        setRecommendationChecked(e.target.value);
                      }}
                      className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      defaultChecked
                    />
                    <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      {t('options.no')}
                    </label>
                  </div>
                  <div>
                    <input
                      id="recommendation"
                      type="radio"
                      value="true"
                      {...register('recommendationFields.recommendation')}
                      onChange={(e) => {
                        setRecommendationChecked(e.target.value);
                      }}
                      className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="ms-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                      {t('options.yes')}
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-2 min-h-6 ">
                {errors.recommendationFields?.recommendation?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.recommendationFields.recommendation.message}
                  </p>
                )}
              </div>
            </div>

            <section
              className={`${
                recommendationChecked === 'false' ? 'opacity-50' : ''
              }`}
            >
              <div>
                <label
                  htmlFor="recommendations_contact"
                  className="text-base font-semibold leading-7 text-gray-900"
                >
                  {t('opportunities.other.contactInformation')}
                </label>
                <textarea
                  {...register('recommendationFields.recommendations_contact')}
                  id="recommendations_contact"
                  cols={30}
                  rows={10}
                  disabled={recommendationChecked === 'false'}
                  className="mt-2 block h-28 w-full resize-none rounded-lg border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                ></textarea>
                <div className="mt-2 min-h-6 ">
                  {errors.recommendationFields?.recommendations_contact
                    ?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {
                        errors.recommendationFields.recommendations_contact
                          .message
                      }
                    </p>
                  )}
                </div>
              </div>
            </section>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
