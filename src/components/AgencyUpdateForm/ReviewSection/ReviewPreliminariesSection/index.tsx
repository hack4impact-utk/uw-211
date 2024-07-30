import { HoursReview } from '@/components/HoursReview';
import { convertToString } from '@/utils/stringArrays';
import { PreliminariesFormData } from '@/utils/types/agency-update-form';
import { useTranslations } from 'next-intl';

interface ReviewPreliminariesSectionProps {
  formData: PreliminariesFormData;
}
const legalStatuses = new Map([
  ['Federal', 'preliminaries.general.legalStatus.options.federal'],
  ['State', 'preliminaries.general.legalStatus.options.state'],
  ['County', 'preliminaries.general.legalStatus.options.county'],
  ['City', 'preliminaries.general.legalStatus.options.city'],
  ['Non-profit', 'preliminaries.general.legalStatus.options.nonprofit'],
  ['501(c)3', 'preliminaries.general.legalStatus.options.501c3'],
  ['Faith-based', 'preliminaries.general.legalStatus.options.faith'],
  ['For profit', 'preliminaries.general.legalStatus.options.profit'],
  ['Other', 'preliminaries.general.legalStatus.options.other'],
]);

export default function ReviewPreliminariesSection({
  formData,
}: ReviewPreliminariesSectionProps) {
  const t = useTranslations('Form');

  // TODO: potential refactor
  const getFundingSource = () => {
    const sources = new Map([
      ['federal', t('preliminaries.operations.funding.options.federal')],
      ['state', t('preliminaries.operations.funding.options.state')],
      ['county', t('preliminaries.operations.funding.options.county')],
      ['city', t('preliminaries.operations.funding.options.city')],
      ['donations', t('preliminaries.operations.funding.options.donations')],
      [
        'foundations',
        t('preliminaries.operations.funding.options.foundations'),
      ],
      ['feesDues', t('preliminaries.operations.funding.options.fees')],
      ['unitedWay', t('preliminaries.operations.funding.options.unitedWay')],
      ['other', t('preliminaries.operations.funding.options.other')],
    ]);

    const fundingSource = formData.fundingSources;
    const options: string[] = [];
    let other: string = '';

    Object.entries(fundingSource).forEach(([key, value]) => {
      if (value && key != 'none' && key != 'other') {
        options.push(sources.get(key)!);
      }
    });

    if (fundingSource.other?.selected) {
      other = String(fundingSource.other.content);
      options.push(
        t('services.preliminaries.operations.funding.options.other')
      );
    }
    return (
      <>
        <p>
          {options.map((item, index) => (
            <span key={index}>
              {item}
              {index !== options.length - 1 && ', '}
            </span>
          ))}
        </p>
        <div className="ml-6">
          {other != '' && (
            <p>
              Other: <span className="underline">{other}</span>
            </p>
          )}
        </div>
      </>
    );
  };

  const legalStatus = t(legalStatuses.get(formData.legalStatus));

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-base font-semibold leading-7 text-gray-900 underline underline-offset-2">
        {t('preliminaries.title')}
      </h2>

      {/* General */}
      <section className="mb-2">
        <h2 className="mb-4 text-base font-semibold leading-7 text-gray-900">
          {t('preliminaries.general.title')}
        </h2>
        <div className="flex w-full flex-col gap-4 md:flex-row">
          {/* 1st Column */}
          <div className="flex w-full flex-col gap-2 md:w-1/3">
            {/* Legal Name */}
            <div className="flex flex-row items-start">
              <p className="w-1/2 text-base font-semibold leading-7 text-gray-900">
                {t('preliminaries.general.name') + ':'}
              </p>
              <p className="w-1/2">{formData.legalName}</p>
            </div>

            {/* AKAs */}
            <div className="flex flex-row items-start">
              {formData.akas ? (
                <>
                  <p className="w-1/2 text-base font-semibold leading-7 text-gray-900">
                    {t('preliminaries.general.aka') + ':'}
                  </p>
                  <p className="w-1/2">{formData.akas}</p>
                </>
              ) : (
                <>
                  <p className="text-md w-1/2 leading-6 text-gray-400">
                    {t('preliminaries.general.aka') + ':'}
                  </p>
                  <p className="w-1/2 text-gray-400">N/A</p>
                </>
              )}
            </div>

            {/* Legal Status */}
            <div className="flex flex-row items-start">
              <p className="w-1/2 text-base font-semibold leading-7 text-gray-900">
                {t('preliminaries.general.legalStatus.title') + ':'}
              </p>
              <p className="w-1/2">{legalStatus}</p>
            </div>

            {/* Director Name */}
            <div className="flex flex-row items-start">
              <p className="w-1/2 text-base font-semibold leading-7 text-gray-900">
                {t('preliminaries.general.director') + ':'}
              </p>
              <p className="w-1/2">{formData.directorName}</p>
            </div>
          </div>

          {/* Second Column */}
          <div className="flex w-full flex-col gap-2 md:w-1/3">
            {/* Main Phone Number */}
            <div className="flex flex-row items-start">
              <p className="w-1/2 text-base font-semibold leading-7 text-gray-900">
                {t('preliminaries.general.phone') + ':'}
              </p>
              <p className="w-1/2">{formData.contactInfo.phoneNumber}</p>
            </div>

            {/* Fax Number */}
            <div className="flex flex-row items-start">
              {formData.contactInfo.faxNumber ? (
                <>
                  <p className="w-1/2 text-base font-semibold leading-7 text-gray-900">
                    {t('preliminaries.general.fax') + ':'}
                  </p>
                  <p className="w-1/2">{formData.contactInfo.faxNumber}</p>
                </>
              ) : (
                <>
                  <p className="text-md w-1/2 leading-6 text-gray-400">
                    {t('preliminaries.general.fax') + ':'}
                  </p>
                  <p className="w-1/2 text-gray-400">N/A</p>
                </>
              )}
            </div>

            {/* Toll Free Number */}
            <div className="flex flex-row items-start">
              <p className="w-1/2 text-base font-semibold leading-7 text-gray-900">
                {t('preliminaries.general.tollFree') + ':'}
              </p>
              <p className="w-1/2">{formData.contactInfo.tollFreeNumber}</p>
            </div>

            {/* TDD/TTY Number */}
            <div className="flex flex-row items-start">
              <p className="w-1/2 text-base font-semibold leading-7 text-gray-900">
                {t('preliminaries.general.tddTty') + ':'}
              </p>
              <p className="w-1/2">{formData.contactInfo.TDDTTYNumber}</p>
            </div>
          </div>

          {/* Third Column */}
          <div className="flex w-full flex-col gap-2 md:w-1/3">
            {/* Additional Numbers */}
            <p className="w-1/2 text-base font-semibold leading-7 text-gray-900">
              {t('review.additional.title')}
            </p>

            {formData.contactInfo.additionalNumbers === undefined ? (
              <p className="leading-6 text-gray-400">
                {t('review.additional.none')}
              </p>
            ) : (
              <div className="max-h-24 w-full overflow-y-auto">
                {formData.contactInfo.additionalNumbers?.map((n, index) => (
                  <div
                    key={index}
                    className="ml-4 grid w-3/4 grid-cols-2 items-center"
                  >
                    <p className="text-base font-medium leading-7 text-gray-900">
                      {n.label}:
                    </p>
                    <p>{n.number}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-row items-start">
              <p className="w-1/2 text-base font-semibold leading-7 text-gray-900">
                {t('preliminaries.general.email') + ':'}
              </p>
              <p className="w-1/2">{formData.contactInfo.email}</p>
            </div>

            {/* Website */}
            <div className="flex flex-row items-start">
              {formData.contactInfo.website ? (
                <>
                  <p className="w-1/2 text-base font-semibold leading-7 text-gray-900">
                    {t('preliminaries.general.website') + ':'}
                  </p>
                  <p className="w-1/2">{formData.contactInfo.website}</p>
                </>
              ) : (
                <>
                  <p className="text-md w-1/2 leading-6 text-gray-400">
                    {t('preliminaries.general.website') + ':'}
                  </p>
                  <p className="w-1/2 text-gray-400">N/A</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Brief Agency Information */}
        <p className="mt-8 text-base font-semibold leading-7 text-gray-900">
          {t('preliminaries.general.agencyInfo') + ':'}
        </p>
        <p>{formData.agencyInfo}</p>
      </section>

      <hr />

      {/* Operations */}
      <section className="my-2">
        <h2 className="mb-4 text-base font-semibold leading-7 text-gray-900">
          {t('preliminaries.operations.title')}
        </h2>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2">
            {/* Hours of Operation */}
            <div className="mb-6">
              <h3 className="mb-4 text-base font-semibold leading-7 text-gray-900">
                {t('preliminaries.operations.hours')}
              </h3>

              <HoursReview hours={formData.hours} />
            </div>

            {/* Funding Source */}
            <div>
              <h3 className="mb-4 text-base font-semibold leading-7 text-gray-900">
                {t('preliminaries.operations.funding.title')}
              </h3>
              {getFundingSource()}
            </div>
          </div>

          {/* Location Information */}
          <div className="w-full md:w-1/2">
            <h3 className="mb-4 text-base font-semibold leading-7 text-gray-900">
              {t('preliminaries.operations.location.title')}
            </h3>

            <div className="flex w-full flex-col gap-2">
              {/* Is the physical address confidential? */}
              <div className="flex flex-row items-start gap-4">
                <p className="w-1/2 text-base font-semibold leading-7 text-gray-900 md:w-2/3">
                  {t('preliminaries.operations.location.confidential')}
                </p>
                <p className="w-1/2 md:w-1/3">
                  {formData.location.confidential.toString() === 'true'
                    ? t('options.yes')
                    : t('options.no')}
                </p>
              </div>

              {/* Physical Address */}
              <div className="flex flex-row items-start gap-4">
                <p className="w-1/2 text-base font-semibold leading-7 text-gray-900 md:w-2/3">
                  {t('preliminaries.operations.location.address.physical') +
                    ':'}
                </p>
                <p className="w-1/2 md:w-1/3">
                  {formData.location.physicalAddress}
                </p>
              </div>

              {/* Mailing Address */}
              <div className="flex flex-row items-start gap-4">
                {formData.location.mailingAddress ? (
                  <>
                    <p className="w-1/2 text-base font-semibold leading-7 text-gray-900 md:w-2/3">
                      {t('review.mailing.title') + ':'}
                    </p>
                    <p className="w-1/2 md:w-1/3">
                      {formData.location.mailingAddress}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-md w-1/2 leading-6 text-gray-400 md:w-2/3">
                      {t('review.mailing.title') + ':'}
                    </p>
                    <p className="w-1/2 text-gray-400 md:w-1/3">
                      {t('review.mailing.none')}
                    </p>
                  </>
                )}
              </div>

              {/* County */}
              <div className="flex flex-row items-start gap-4">
                <p className="w-1/2 text-base font-semibold leading-7 text-gray-900 md:w-2/3">
                  {t('preliminaries.operations.location.address.county') + ':'}
                </p>
                <p className="w-1/2 md:w-1/3">{formData.location.county}</p>
              </div>

              {/* City */}
              <div className="flex flex-row items-start gap-4">
                <p className="w-1/2 text-base font-semibold leading-7 text-gray-900 md:w-2/3">
                  {t('preliminaries.operations.location.address.city') + ':'}
                </p>
                <p className="w-1/2 md:w-1/3">{formData.location.city}</p>
              </div>

              {/* State */}
              <div className="flex flex-row items-start gap-4">
                <p className="w-1/2 text-base font-semibold leading-7 text-gray-900 md:w-2/3">
                  {t('preliminaries.operations.location.address.state') + ':'}
                </p>
                <p className="w-1/2 md:w-1/3">{formData.location.state}</p>
              </div>

              {/* Zip Code */}
              <div className="flex flex-row items-start gap-4">
                <p className="w-1/2 text-base font-semibold leading-7 text-gray-900 md:w-2/3">
                  {t('preliminaries.operations.location.address.zip') + ':'}
                </p>
                <p className="w-1/2 md:w-1/3">{formData.location.zipCode}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr />

      {/* Additional */}
      <section className="my-2">
        <h2 className="mb-4 text-base font-semibold leading-7 text-gray-900">
          {t('preliminaries.additional.title')}
        </h2>

        <div className="flex flex-col md:flex-row">
          {/* Service Area */}
          <div className="md:w-1/2">
            <h3 className="mb-4 w-1/2 text-base font-semibold leading-7 text-gray-900">
              {t('preliminaries.additional.serviceArea.title')}
            </h3>

            <div className="flex flex-col gap-4">
              {/* Specific Town/City */}
              {formData.serviceArea.townCity != '' && (
                <div className="flex flex-col items-start gap-2 md:flex-row md:gap-0">
                  <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                    {t('preliminaries.additional.serviceArea.townCity') + ':'}
                  </p>
                  <p className="w-full md:w-1/2">
                    {formData.serviceArea.townCity}
                  </p>
                </div>
              )}

              {/* Specific Zip Codes */}
              {formData.serviceArea.zipCodes.length != 0 && (
                <div className="flex flex-col items-start gap-2 md:flex-row md:gap-0">
                  <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                    {t('preliminaries.additional.serviceArea.zip') + ':'}
                  </p>
                  <p className="w-full md:w-1/2">
                    {convertToString(formData.serviceArea.zipCodes)}
                  </p>
                </div>
              )}

              {/* Specific Counties */}
              {formData.serviceArea.counties.length != 0 && (
                <div className="flex flex-col items-start gap-2 md:flex-row md:gap-0">
                  <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                    {t('preliminaries.additional.serviceArea.county') + ':'}
                  </p>
                  <p className="w-full md:w-1/2">
                    {convertToString(formData.serviceArea.counties)}
                  </p>
                </div>
              )}

              {/* Statewide */}
              {formData.serviceArea.statewide && (
                <div className="flex flex-row items-start">
                  <p className="w-1/2 text-base font-semibold leading-7 text-gray-900">
                    {t('preliminaries.additional.serviceArea.state') + ':'}
                  </p>
                  <p className="w-1/2">
                    {formData.serviceArea.statewide && 'Yes'}
                  </p>
                </div>
              )}

              {/* Nationwide */}
              {formData.serviceArea.nationwide && (
                <div className="flex flex-row items-start">
                  <p className="w-1/2 text-base font-semibold leading-7 text-gray-900">
                    {t('preliminaries.additional.serviceArea.nation') + ':'}
                  </p>
                  <p className="w-1/2">
                    {formData.serviceArea.nationwide && 'Yes'}
                  </p>
                </div>
              )}

              {/* Other */}
              {formData.serviceArea.other != '' && (
                <div className="flex flex-row items-start">
                  <p className="w-1/2 text-base font-semibold leading-7 text-gray-900">
                    {t('preliminaries.additional.serviceArea.other') + ':'}
                  </p>
                  <p className="w-1/2">{formData.serviceArea.other}</p>
                </div>
              )}
            </div>
          </div>

          {/* Annual Agency Update */}
          <div className="mt-8 md:mt-0 md:w-1/2">
            <h3 className="mb-4 text-base font-semibold leading-7 text-gray-900">
              {t('preliminaries.additional.agencyUpdate.title')}
            </h3>

            <div className="flex w-full flex-col gap-2">
              {/* Name */}
              <div className="flex flex-row items-start gap-4">
                <p className="w-1/2 text-base font-semibold leading-7 text-gray-900 md:w-2/3">
                  {t('preliminaries.additional.agencyUpdate.name') + ':'}
                </p>
                <p className="w-1/2 md:w-1/3">
                  {formData.annualAgencyUpdate.name}
                </p>
              </div>

              {/* Title */}
              <div className="flex flex-row items-start gap-4">
                <p className="w-1/2 text-base font-semibold leading-7 text-gray-900 md:w-2/3">
                  {t('preliminaries.additional.agencyUpdate.contactTitle') +
                    ':'}
                </p>
                <p className="w-1/2 md:w-1/3">
                  {formData.annualAgencyUpdate.title}
                </p>
              </div>

              {/* Phone Number */}
              <div className="flex flex-row items-start gap-4">
                <p className="w-1/2 text-base font-semibold leading-7 text-gray-900 md:w-2/3">
                  {t('preliminaries.additional.agencyUpdate.phone') + ':'}
                </p>
                <p className="w-1/2 md:w-1/3">
                  {formData.annualAgencyUpdate.phoneNumber}
                </p>
              </div>

              {/* Email */}
              <div className="flex flex-row items-start gap-4">
                <p className="w-1/2 text-base font-semibold leading-7 text-gray-900 md:w-2/3">
                  {t('preliminaries.additional.agencyUpdate.email') + ':'}
                </p>
                <p className="w-1/2 md:w-1/3">
                  {formData.annualAgencyUpdate.email}
                </p>
              </div>

              {/* Would you like this information to be hidden from the website? */}
              <div className="flex flex-row items-end gap-4">
                <div className="w-1/2 md:w-2/3">
                  <p className="w-3/4 text-base font-semibold leading-7 text-gray-900">
                    {t('preliminaries.additional.agencyUpdate.confidential')}
                  </p>
                </div>
                <p className="w-1/2 md:w-1/3">
                  {formData.annualAgencyUpdate.hideFromWebsite?.toString() ===
                  'true'
                    ? t('options.yes')
                    : t('options.no')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
