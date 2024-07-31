import Hours from '@/components/Hours';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ServicesFormData } from '@/utils/types/agency-update-form';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

interface ServicesFormProps {
  serviceIdx: number;
  useFormResult: ReturnType<typeof useForm<ServicesFormData>>;
}

export default function ServicesForm({
  serviceIdx,
  useFormResult: {
    register,
    watch,
    formState: { errors },
    control,
  },
}: ServicesFormProps) {
  const t = useTranslations('Form');

  return (
    <div className="mt-2 px-4 py-2">
      <label
        htmlFor="name"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {t('services.name.title')}
      </label>
      <Input
        id="name"
        className="mb-2"
        {...register(`services.${serviceIdx}.name`)}
      />
      <div className="mt-2 min-h-6 ">
        {errors.services?.[serviceIdx]?.name?.message && (
          <p className="mt-2 text-sm text-red-400">
            {errors.services[serviceIdx]?.name?.message}
          </p>
        )}
      </div>

      <label
        htmlFor="description"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {t('services.description')}
      </label>
      <Textarea
        id="description"
        className="mb-2"
        {...register(`services.${serviceIdx}.fullDescription`)}
      />
      <div className="mt-2 min-h-6 ">
        {errors.services?.[serviceIdx]?.fullDescription?.message && (
          <p className="mt-2 text-sm text-red-400">
            {errors.services[serviceIdx]?.fullDescription?.message}
          </p>
        )}
      </div>

      <label
        htmlFor="contact"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {t('services.contact.title')}
      </label>
      <Input
        id="contact"
        className="mb-2"
        placeholder={t('services.contact.description')}
        {...register(`services.${serviceIdx}.contactPersonName`)}
      />

      <label
        htmlFor="hours"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {t('services.hours')}
      </label>
      <div className="mb-4 ml-2">
        <Hours name={`services.${serviceIdx}.daysOpen`} control={control} />
      </div>

      <label
        htmlFor="eligibility"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {t('services.eligibility.title')}
      </label>
      <Textarea
        id="eligibility"
        className="mb-2"
        placeholder={t('services.eligibility.description')}
        {...register(`services.${serviceIdx}.eligibilityRequirements`)}
      />
      <div className="mt-2 min-h-6 ">
        {errors.services?.[serviceIdx]?.eligibilityRequirements?.message && (
          <p className="mt-2 text-sm text-red-400">
            {errors.services[serviceIdx]?.eligibilityRequirements?.message}
          </p>
        )}
      </div>

      <Separator className="my-4" />

      <label
        htmlFor="applicationProcess"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {t('services.applicationProcess.title')}
      </label>
      <p className="text-sm leading-6 text-gray-600">
        {t('services.applicationProcess.description')}
      </p>
      <div id="applicationProcess" className="mb-2 ml-2 flex flex-col">
        <div className="space-x-2">
          <input
            type="checkbox"
            id="walkIn"
            className="form-checkbox"
            {...register(`services.${serviceIdx}.applicationProcess.walkIn`)}
          />
          <label
            htmlFor="walkIn"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.applicationProcess.walkIn')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="telephone"
            className="form-checkbox"
            {...register(`services.${serviceIdx}.applicationProcess.telephone`)}
          />
          <label
            htmlFor="telephone"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.applicationProcess.telephone')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="appointment"
            className="form-checkbox"
            {...register(
              `services.${serviceIdx}.applicationProcess.appointment`
            )}
          />
          <label
            htmlFor="appointment"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.applicationProcess.appointment')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="online"
            className="form-checkbox"
            {...register(`services.${serviceIdx}.applicationProcess.online`)}
          />
          <label
            htmlFor="online"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.applicationProcess.online')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="applicationProcessOther"
            className="form-checkbox"
            {...register(
              `services.${serviceIdx}.applicationProcess.other.selected`
            )}
          />
          <label
            htmlFor="applicationProcessOther"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.applicationProcess.other.title')}
          </label>
          {watch(`services.${serviceIdx}.applicationProcess.other.selected`) ? (
            <>
              <Input
                className="m-2"
                placeholder={t('services.applicationProcess.other.description')}
                {...register(
                  `services.${serviceIdx}.applicationProcess.other.content`
                )}
              />
              <div className="mt-2 min-h-6 ">
                {errors.services?.[serviceIdx]?.applicationProcess?.other
                  ?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {
                      errors.services[serviceIdx]?.applicationProcess?.other
                        ?.message
                    }
                  </p>
                )}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        <Separator className="my-2 max-w-64" />

        <div className="space-x-2">
          <input
            type="checkbox"
            id="referral"
            className="form-checkbox"
            {...register(
              `services.${serviceIdx}.applicationProcess.referral.required`
            )}
          />
          <label
            htmlFor="referral"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.applicationProcess.referralRequired.title')}
          </label>
          {watch(
            `services.${serviceIdx}.applicationProcess.referral.required`
          ) ? (
            <>
              <Input
                className="m-2"
                placeholder={t(
                  'services.applicationProcess.referralRequired.description'
                )}
                {...register(
                  `services.${serviceIdx}.applicationProcess.referral.content`
                )}
              />
              <div className="mt-2 min-h-6 ">
                {errors.services?.[serviceIdx]?.applicationProcess?.referral
                  ?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {
                      errors.services[serviceIdx]?.applicationProcess?.referral
                        ?.message
                    }
                  </p>
                )}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="mt-2 min-h-6 ">
        {errors.services?.[serviceIdx]?.applicationProcess?.message && (
          <p className="mt-2 text-sm text-red-400">
            {errors.services[serviceIdx]?.applicationProcess?.message}
          </p>
        )}
      </div>

      <Separator className="my-4" />

      <label
        htmlFor="fees"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {t('services.fees.title')}
      </label>
      <p className="text-sm leading-6 text-gray-600">
        {t('services.fees.description')}
      </p>
      <div id="fees" className="mb-2 ml-2 flex flex-col">
        <div className="space-x-2">
          <input
            type="checkbox"
            id="noFees"
            className="form-checkbox"
            {...register(`services.${serviceIdx}.feeCategory.none`)}
          />
          <label
            htmlFor="noFees"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.fees.noFees')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="straight"
            className="form-checkbox"
            {...register(
              `services.${serviceIdx}.feeCategory.straight.selected`
            )}
            disabled={watch(`services.${serviceIdx}.feeCategory.none`)}
          />
          <label
            htmlFor="straight"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.fees.straight.title')}
          </label>
          {watch(`services.${serviceIdx}.feeCategory.straight.selected`) ? (
            <>
              <Input
                className="m-2"
                placeholder={t('services.fees.straight.description')}
                {...register(
                  `services.${serviceIdx}.feeCategory.straight.content`
                )}
                disabled={watch(`services.${serviceIdx}.feeCategory.none`)}
              />
              <div className="mt-2 min-h-6 ">
                {errors.services?.[serviceIdx]?.feeCategory?.straight
                  ?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {
                      errors.services[serviceIdx]?.feeCategory?.straight
                        ?.message
                    }
                  </p>
                )}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="sliding"
            className="form-checkbox"
            {...register(`services.${serviceIdx}.feeCategory.slidingScale`)}
            disabled={watch(`services.${serviceIdx}.feeCategory.none`)}
          />
          <label
            htmlFor="sliding"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.fees.slidingScale')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="medicaid_tenncare"
            className="form-checkbox"
            {...register(
              `services.${serviceIdx}.feeCategory.medicaid_tenncare`
            )}
            disabled={watch(`services.${serviceIdx}.feeCategory.none`)}
          />
          <label
            htmlFor="medicaid_tenncare"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.fees.medicaidTenncare')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="medicare"
            className="form-checkbox"
            {...register(`services.${serviceIdx}.feeCategory.medicare`)}
            disabled={watch(`services.${serviceIdx}.feeCategory.none`)}
          />
          <label
            htmlFor="medicare"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.fees.medicare')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="private"
            className="form-checkbox"
            {...register(`services.${serviceIdx}.feeCategory.private`)}
            disabled={watch(`services.${serviceIdx}.feeCategory.none`)}
          />
          <label
            htmlFor="private"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.fees.private')}
          </label>
        </div>
      </div>
      <div className="mt-2 min-h-6 ">
        {errors.services?.[serviceIdx]?.feeCategory?.message && (
          <p className="mt-2 text-sm text-red-400">
            {errors.services[serviceIdx]?.feeCategory?.message}
          </p>
        )}
      </div>

      <Separator className="my-4" />

      <label
        htmlFor="requiredDocuments"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {t('services.requiredDocuments.title')}
      </label>
      <p className="text-sm leading-6 text-gray-600">
        {t('services.requiredDocuments.description')}
      </p>
      <div id="requiredDocuments" className="mb-2 ml-2 grid grid-cols-3">
        <div className="space-x-2">
          <input
            type="checkbox"
            id="noDocuments"
            className="form-checkbox"
            {...register(`services.${serviceIdx}.requiredDocuments.none`)}
          />
          <label
            htmlFor="noDocuments"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.requiredDocuments.noDocuments')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="stateId"
            className="form-checkbox"
            {...register(`services.${serviceIdx}.requiredDocuments.stateId`)}
            disabled={watch(`services.${serviceIdx}.requiredDocuments.none`)}
          />
          <label
            htmlFor="stateId"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.requiredDocuments.stateId')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="ssn"
            className="form-checkbox"
            {...register(`services.${serviceIdx}.requiredDocuments.ssn`)}
            disabled={watch(`services.${serviceIdx}.requiredDocuments.none`)}
          />
          <label
            htmlFor="ssn"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.requiredDocuments.ssn')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="proofOfResidence"
            className="form-checkbox"
            {...register(
              `services.${serviceIdx}.requiredDocuments.proofOfResidence`
            )}
            disabled={watch(`services.${serviceIdx}.requiredDocuments.none`)}
          />
          <label
            htmlFor="proofOfResidence"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.requiredDocuments.proofOfResidence')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="proofOfIncome"
            className="form-checkbox"
            {...register(
              `services.${serviceIdx}.requiredDocuments.proofOfIncome`
            )}
            disabled={watch(`services.${serviceIdx}.requiredDocuments.none`)}
          />
          <label
            htmlFor="proofOfIncome"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.requiredDocuments.proofOfIncome')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="birthCertificate"
            className="form-checkbox"
            {...register(
              `services.${serviceIdx}.requiredDocuments.birthCertificate`
            )}
            disabled={watch(`services.${serviceIdx}.requiredDocuments.none`)}
          />
          <label
            htmlFor="birthCertificate"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.requiredDocuments.birthCertificate')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="medicalRecords"
            className="form-checkbox"
            {...register(
              `services.${serviceIdx}.requiredDocuments.medicalRecords`
            )}
            disabled={watch(`services.${serviceIdx}.requiredDocuments.none`)}
          />
          <label
            htmlFor="medicalRecords"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.requiredDocuments.medicalRecords')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="psychRecords"
            className="form-checkbox"
            {...register(
              `services.${serviceIdx}.requiredDocuments.psychRecords`
            )}
            disabled={watch(`services.${serviceIdx}.requiredDocuments.none`)}
          />
          <label
            htmlFor="psychRecords"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.requiredDocuments.psychRecords')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="proofOfNeed"
            className="form-checkbox"
            {...register(
              `services.${serviceIdx}.requiredDocuments.proofOfNeed`
            )}
            disabled={watch(`services.${serviceIdx}.requiredDocuments.none`)}
          />
          <label
            htmlFor="proofOfNeed"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.requiredDocuments.proofOfNeed')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="utilityBill"
            className="form-checkbox"
            {...register(
              `services.${serviceIdx}.requiredDocuments.utilityBill`
            )}
            disabled={watch(`services.${serviceIdx}.requiredDocuments.none`)}
          />
          <label
            htmlFor="utilityBill"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.requiredDocuments.utilityBill')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="utilityCutoffNotice"
            className="form-checkbox"
            {...register(
              `services.${serviceIdx}.requiredDocuments.utilityCutoffNotice`
            )}
            disabled={watch(`services.${serviceIdx}.requiredDocuments.none`)}
          />
          <label
            htmlFor="utilityCutoffNotice"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.requiredDocuments.utilityCutoffNotice')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="proofOfCitizenship"
            className="form-checkbox"
            {...register(
              `services.${serviceIdx}.requiredDocuments.proofOfCitizenship`
            )}
            disabled={watch(`services.${serviceIdx}.requiredDocuments.none`)}
          />
          <label
            htmlFor="proofOfCitizenship"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.requiredDocuments.proofOfCitizenship')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="proofOfPublicAssistance"
            className="form-checkbox"
            {...register(
              `services.${serviceIdx}.requiredDocuments.proofOfPublicAssistance`
            )}
            disabled={watch(`services.${serviceIdx}.requiredDocuments.none`)}
          />
          <label
            htmlFor="proofOfPublicAssistance"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.requiredDocuments.proofOfPublicAssistance')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="driversLicense"
            className="form-checkbox"
            {...register(
              `services.${serviceIdx}.requiredDocuments.driversLicense`
            )}
            disabled={watch(`services.${serviceIdx}.requiredDocuments.none`)}
          />
          <label
            htmlFor="driversLicense"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.requiredDocuments.driversLicense')}
          </label>
        </div>

        <div className="space-x-2">
          <input
            type="checkbox"
            id="requiredDocumentsOther"
            className="form-checkbox"
            {...register(
              `services.${serviceIdx}.requiredDocuments.other.selected`
            )}
            disabled={watch(`services.${serviceIdx}.requiredDocuments.none`)}
          />
          <label
            htmlFor="requiredDocumentsOther"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t('services.requiredDocuments.other.title')}
          </label>
          {watch(`services.${serviceIdx}.requiredDocuments.other.selected`) ? (
            <>
              <Input
                className="m-2"
                placeholder={t('services.requiredDocuments.other.description')}
                {...register(
                  `services.${serviceIdx}.requiredDocuments.other.content`
                )}
                disabled={watch(
                  `services.${serviceIdx}.requiredDocuments.none`
                )}
              />
              <div className="mt-2 min-h-6 ">
                {errors.services?.[serviceIdx]?.requiredDocuments?.other
                  ?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {
                      errors.services[serviceIdx]?.requiredDocuments?.other
                        ?.message
                    }
                  </p>
                )}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="mt-2 min-h-6 ">
        {errors.services?.[serviceIdx]?.requiredDocuments?.message && (
          <p className="mt-2 text-sm text-red-400">
            {errors.services[serviceIdx]?.requiredDocuments?.message}
          </p>
        )}
      </div>
    </div>
  );
}
