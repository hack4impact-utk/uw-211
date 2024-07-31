import { OpportunitiesFormData } from '@/utils/types/agency-update-form';
import { CornerDownRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ReviewOpportunitiesSectionProps {
  formData: OpportunitiesFormData;
}

export default function ReviewOpportunitiesSection({
  formData,
}: ReviewOpportunitiesSectionProps) {
  const t = useTranslations('Form');

  return (
    <section className="mt-8 flex flex-col gap-4 sm:mt-0">
      <h2 className="text-base font-semibold leading-7 text-gray-900 underline underline-offset-2">
        {t('opportunities.title')}
      </h2>

      <section className="flex flex-col gap-8">
        {/* Volunteers */}
        <section>
          <div className="flex flex-col sm:flex-row sm:gap-16">
            <p className="text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
              {t('opportunities.acceptVolunteers.title')}
            </p>

            <p className="sm:w-1/2">
              {formData.volunteerFields.volunteers == 'true'
                ? t('options.yes')
                : t('options.no')}
            </p>
          </div>

          {formData.volunteerFields.volunteers == 'true' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:gap-16">
                <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                  <CornerDownRight className="mr-1" />
                  {t('opportunities.acceptVolunteers.eligibility.title')}
                </p>

                <p className="sm:w-1/2">{formData.volunteerFields.vol_reqs}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-16">
                <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                  <CornerDownRight className="mr-1" />
                  {t('opportunities.acceptVolunteers.eligibility.coordinator')}
                </p>

                <p className="sm:w-1/2">{formData.volunteerFields.vol_coor}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-16">
                <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                  <CornerDownRight className="mr-1" />
                  {t('opportunities.acceptVolunteers.eligibility.phone')}
                </p>

                <p className="sm:w-1/2">
                  {formData.volunteerFields.vol_coor_tel}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Donations */}
        <section>
          <div className="flex flex-col sm:flex-row sm:gap-16">
            <p className="text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
              {t('opportunities.acceptDonations.title')}
            </p>

            <p className="sm:w-1/2">
              {formData.donationFields.donation == 'true'
                ? t('options.yes')
                : t('options.no')}
            </p>
          </div>

          {formData.donationFields.donation == 'true' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:gap-16">
                <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                  <CornerDownRight className="mr-1" />
                  {t('opportunities.acceptDonations.list.title')}
                </p>

                <p className="sm:w-1/2">{formData.donationFields.don_ex}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-16">
                <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                  <CornerDownRight className="mr-1" />
                  {t('opportunities.acceptDonations.pickup.title')}
                </p>

                <p className="sm:w-1/2">
                  {formData.donationFields.pickup == 'true'
                    ? t('options.yes')
                    : t('options.no')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-16">
                <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                  <CornerDownRight className="ml-6 mr-1" />
                  {t('opportunities.acceptDonations.pickup.where')}
                </p>

                <p className="ml-6 flex sm:ml-0 sm:w-1/2">
                  {formData.donationFields.pickup_loc}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-16">
                <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                  <CornerDownRight className="mr-1" />
                  {t('opportunities.acceptDonations.coordinator')}
                </p>

                <p className="sm:w-1/2">{formData.donationFields.don_coor}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-16">
                <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                  <CornerDownRight className="mr-1" />
                  {t('opportunities.acceptDonations.phone')}
                </p>
                <p className="sm:w-1/2">
                  {formData.donationFields.don_coor_tel}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Recommendations */}
        <section>
          <div className="flex flex-col sm:flex-row sm:gap-16">
            <p className="text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
              {t('opportunities.other.title')}
            </p>

            <p className="sm:w-1/2">
              {formData.recommendationFields?.recommendation == 'true'
                ? t('options.yes')
                : t('options.no')}
            </p>
          </div>

          {formData.recommendationFields?.recommendation == 'true' && (
            <div className="flex flex-col sm:flex-row sm:gap-16">
              <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                <CornerDownRight className="mr-1" />
                {t('opportunities.other.contactInformation')}
              </p>

              <p className="sm:w-1/2">
                {formData.recommendationFields.recommendations_contact}
              </p>
            </div>
          )}
        </section>
      </section>
    </section>
  );
}
