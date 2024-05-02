'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import {
  FormDataSchema,
  ServiceSchema,
} from '@/utils/constants/formDataSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import Footer from '@/components/Footer';
import ServicesReview from '@/components/ServicesReview';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, CornerDownRight } from 'lucide-react';
import FormStepper from '@/components/FormStepper';
import { useWindowSize } from '@/utils/hooks/useWindowSize';
import {
  Carousel,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
  CarouselItem,
} from '@/components/ui/carousel';
import {
  Sheet,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetContent,
} from '@/components/ui/sheet';
import { useBeforeUnload } from '@/utils/hooks/useBeforeUnload';
import { formSteps } from '@/utils/constants/formSteps';
import { createAgencyInfoWithServices } from '@/server/actions/Agencies';
import { zodFormToTs } from '@/utils/conversions';
import { convertToArray, convertToString } from '@/utils/stringArrays';
import Hours from '@/components/Hours';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';
import AdditionalNumbers from '@/components/AdditionalNumbers';
import { useTranslations } from 'next-intl';

type Inputs = z.infer<typeof FormDataSchema>;
type Service = z.infer<typeof ServiceSchema>;

const steps = formSteps;

export default function Form({ params }: { params: { id: string } }) {
  const t = useTranslations('Form');

  const [previousStep, setPreviousStep] = useState(-1);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubstep, setCurrentSubstep] = useState(0);
  const [previousSubstep, setPreviousSubstep] = useState(-1);
  const delta = currentStep - previousStep;
  const subdelta = currentSubstep - previousSubstep;

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    watch,
    formState: { errors, isDirty },
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      services: [],
    },
  });

  useBeforeUnload(isDirty);
  const { width: screenWidth } = useWindowSize();

  const processForm: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading(true);
      const validatedInfo = zodFormToTs(data);
      await createAgencyInfoWithServices(params.id, validatedInfo);
      setIsLoading(false);

      router.push('/complete');
    } catch (error) {
      console.error(error);
    }
  };

  type FieldName = keyof Inputs;

  const next = async () => {
    const subpage_length = steps[currentStep].subpages.length - 1;
    const fields = steps[currentStep].subpages[currentSubstep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length) {
      if (currentStep + currentSubstep === steps.length + subpage_length - 1) {
        await handleSubmit(processForm)();
      }

      if (currentSubstep < subpage_length) {
        // if there are more subpages in current page
        setPreviousSubstep(currentSubstep);
        setCurrentSubstep((substep) => substep + 1);
      } else {
        // at the end of all subpages, go to next page
        setPreviousStep(currentStep);
        setCurrentStep((step) => step + 1);
        setCurrentSubstep(0);
        setPreviousSubstep(-1);
      }
      window.scrollTo(0, 0);
    }
  };

  const prev = () => {
    // if it is not the beginning of the form
    if (currentStep > 0 || currentSubstep > 0) {
      if (currentSubstep > 0) {
        // you are inside a page with subpages
        setPreviousSubstep(currentSubstep);
        setCurrentSubstep((substep) => substep - 1);
      } else {
        // at beginning of subpages, go back a to the last subpage of prev page
        setPreviousStep(currentStep);
        setCurrentStep((step) => step - 1);
        setPreviousSubstep(steps[currentStep - 1].subpages.length);
        setCurrentSubstep(steps[currentStep - 1].subpages.length - 1);
      }
    }
  };

  const [volunteerChecked, setVolunteerChecked] = useState('false');
  const [donationChecked, setDonationChecked] = useState('false');
  const [pickupChecked, setPickupChecked] = useState('false');
  const [recommendationChecked, setRecommendationChecked] = useState('false');

  const [serviceIdx, setServiceIdx] = useState(-1);
  useEffect(() => {
    setValue(`services.${serviceIdx}`, getValues(`services.${serviceIdx}`));
  }, [getValues, serviceIdx, setValue]);

  const add_service = () => {
    const idx = getValues('services').length;
    const new_service: Service = {
      name: t('services.name.placeholder', {
        number: getValues('services').length + 1,
      }),
      id: Date.now(),
      contactPersonName: '',
      daysOpen: [],
      fullDescription: '',
      eligibilityRequirements: '',
      applicationProcess: {
        walkIn: false,
        telephone: false,
        appointment: false,
        online: false,
        other: {
          selected: false,
          content: '',
        },
        referral: {
          required: false,
          content: '',
        },
      },
      feeCategory: {
        none: false,
        straight: {
          selected: false,
          content: '',
        },
        slidingScale: false,
        medicaid_tenncare: false,
        medicare: false,
        private: false,
      },
      requiredDocuments: {
        none: false,
        stateId: false,
        ssn: false,
        proofOfResidence: false,
        proofOfIncome: false,
        birthCertificate: false,
        medicalRecords: false,
        psychRecords: false,
        proofOfNeed: false,
        utilityBill: false,
        utilityCutoffNotice: false,
        proofOfCitizenship: false,
        proofOfPublicAssistance: false,
        driversLicense: false,
        other: {
          selected: false,
          content: '',
        },
      },
      isSeasonal: false,
    };

    getValues('services').push(new_service);
    setServiceIdx(idx);
  };

  const delete_service = (id: number) => {
    const deleteIdx = getValues('services').findIndex(
      (service: Service) => service.id === id
    );
    getValues('services').splice(deleteIdx, 1);

    if (serviceIdx === deleteIdx) {
      setServiceIdx(-1);
    } else if (serviceIdx > deleteIdx) {
      setServiceIdx(serviceIdx - 1);
    }
  };

  const ServicesForm = () => {
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
              {...register(
                `services.${serviceIdx}.applicationProcess.telephone`
              )}
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
            {watch(
              `services.${serviceIdx}.applicationProcess.other.selected`
            ) ? (
              <>
                <Input
                  className="m-2"
                  placeholder={t(
                    'services.applicationProcess.other.description'
                  )}
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
                        errors.services[serviceIdx]?.applicationProcess
                          ?.referral?.message
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
            {watch(
              `services.${serviceIdx}.requiredDocuments.other.selected`
            ) ? (
              <>
                <Input
                  className="m-2"
                  placeholder={t(
                    'services.requiredDocuments.other.description'
                  )}
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
  };

  const get_services = () => {
    const services = getValues('services');

    let service_items = [];

    if (screenWidth < 720 || services.length > 2) {
      service_items = services.map((service: Service, index: number) => (
        <CarouselItem className="lg:basis-1/2" key={index}>
          {ServicesReview(service)}
        </CarouselItem>
      ));
    } else {
      service_items = services.map((service: Service, index: number) => (
        <div className="w-full lg:w-1/2" key={index}>
          {ServicesReview(service)}
        </div>
      ));
    }

    return service_items;
  };

  const get_fundingSource = () => {
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

    const fundingSource = getValues('fundingSources');
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

  const PreliminariesHeader = (data: { name: string }) => {
    return (
      <>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          {t('preliminaries.title')} - {data.name}
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          {t('preliminaries.description')}
        </p>
      </>
    );
  };

  const get_accessibility_langs = () => {
    const language = getValues('languageSupport');
    let result = '';

    if (language.asl)
      result += t('preliminaries.accessibility.languages.options.asl') + ', ';
    if (language.spanish)
      result +=
        t('preliminaries.accessibility.languages.options.spanish') + ', ';
    if (language.teleinterpreterLanguageService)
      result += t('preliminaries.accessibility.languages.options.tele') + ', ';
    if (language.other.selected) {
      result += convertToString(language.other.content!);
      result += ', ';
    }

    return result.substring(0, result.length - 2);
  };

  return (
    <section className="absolute inset-0 flex flex-col justify-between pl-4 pr-4 pt-24 sm:px-12 md:px-20">
      {/* Stepper */}
      <FormStepper
        currentPageIndex={currentStep}
        currentSubpageIndex={currentSubstep}
        formSteps={steps}
        setCurrentStep={setCurrentStep}
        setCurrentSubstep={setCurrentSubstep}
      />

      {/* Form */}
      <form className="py-6" onSubmit={handleSubmit(processForm)}>
        {/* Preliminaries */}
        {currentStep === 0 && (
          <motion.div
            initial={{
              x: delta >= 0 ? '50%' : '-50%',
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* General Subpage */}
            {currentSubstep === 0 && (
              <motion.div
                initial={{
                  x: subdelta >= 0 ? '50%' : '-50%',
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
                              {t(
                                'preliminaries.general.legalStatus.options.empty'
                              )}
                            </option>
                            <option value="Federal">
                              {t(
                                'preliminaries.general.legalStatus.options.federal'
                              )}
                            </option>
                            <option value="State">
                              {t(
                                'preliminaries.general.legalStatus.options.state'
                              )}
                            </option>
                            <option value="County">
                              {t(
                                'preliminaries.general.legalStatus.options.county'
                              )}
                            </option>
                            <option value="City">
                              {t(
                                'preliminaries.general.legalStatus.options.city'
                              )}
                            </option>
                            <option value="Non-profit">
                              {t(
                                'preliminaries.general.legalStatus.options.nonprofit'
                              )}
                            </option>
                            <option value="501(c)3">
                              {t(
                                'preliminaries.general.legalStatus.options.501c3'
                              )}
                            </option>
                            <option value="Faith-based">
                              {t(
                                'preliminaries.general.legalStatus.options.faith'
                              )}
                            </option>
                            <option value="For profit">
                              {t(
                                'preliminaries.general.legalStatus.options.profit'
                              )}
                            </option>
                            <option value="Other">
                              {t(
                                'preliminaries.general.legalStatus.options.other'
                              )}
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
                            {t('preliminaries.general.toll-free')}
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
                            {t('preliminaries.general.tdd-tty')}
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
            )}

            {/* Operations Subpage */}
            {currentSubstep === 1 && (
              <motion.div
                initial={{
                  x: subdelta >= 0 ? '50%' : '-50%',
                  opacity: 0,
                }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <PreliminariesHeader
                  name={t('preliminaries.operations.title')}
                />

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
                              {t(
                                'preliminaries.operations.funding.options.federal'
                              )}
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
                              {t(
                                'preliminaries.operations.funding.options.state'
                              )}
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
                              {t(
                                'preliminaries.operations.funding.options.county'
                              )}
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
                              {t(
                                'preliminaries.operations.funding.options.city'
                              )}
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
                              {t(
                                'preliminaries.operations.funding.options.donations'
                              )}
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
                              {t(
                                'preliminaries.operations.funding.options.foundations'
                              )}
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
                              {t(
                                'preliminaries.operations.funding.options.fees'
                              )}
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
                              {t(
                                'preliminaries.operations.funding.options.unitedWay'
                              )}
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
                              {t(
                                'preliminaries.operations.funding.options.other'
                              )}
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
                          {t(
                            'preliminaries.operations.location.address.physical'
                          )}
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
                          {t(
                            'preliminaries.operations.location.address.mailing'
                          )}
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
                          {t(
                            'preliminaries.operations.location.address.county'
                          )}
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
                            {t(
                              'preliminaries.operations.location.address.city'
                            )}
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
                            {t(
                              'preliminaries.operations.location.address.state'
                            )}
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
            )}

            {/* Additional Subpage */}
            {currentSubstep === 2 && (
              <motion.div
                initial={{
                  x: subdelta >= 0 ? '50%' : '-50%',
                  opacity: 0,
                }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <PreliminariesHeader
                  name={t('preliminaries.additional.title')}
                />

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
                          {t(
                            'preliminaries.additional.serviceArea.description'
                          )}
                        </p>
                      </div>

                      <div className="flex flex-col gap-8">
                        {/* serviceArea.townCity */}
                        <div>
                          <label
                            htmlFor="serviceArea.townCity"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            {t(
                              'preliminaries.additional.serviceArea.town-city'
                            )}
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
                                {t(
                                  'preliminaries.additional.serviceArea.state'
                                )}
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
                                {t(
                                  'preliminaries.additional.serviceArea.nation'
                                )}
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
                          {t(
                            'preliminaries.additional.agencyUpdate.description'
                          )}
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
                            {t(
                              'preliminaries.additional.agencyUpdate.contactTitle'
                            )}
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
                          {t(
                            'preliminaries.additional.agencyUpdate.confidential'
                          )}
                          <span className="ml-1 text-sm text-red-400">*</span>
                        </h2>
                        <div className="flex flex-row gap-4 whitespace-nowrap">
                          <div>
                            <input
                              id="annualAgencyUpdate.hideFromWebsite1"
                              type="radio"
                              value=""
                              {...register(
                                'annualAgencyUpdate.hideFromWebsite'
                              )}
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
                              {...register(
                                'annualAgencyUpdate.hideFromWebsite'
                              )}
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
                        {errors.annualAgencyUpdate?.hideFromWebsite
                          ?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.annualAgencyUpdate.hideFromWebsite.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </section>
                </section>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Accessibility */}
        {currentStep === 1 && (
          <motion.div
            initial={{
              x: delta >= 0 ? '50%' : '-50%',
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Accessibility Subpage */}
            {currentSubstep === 0 && (
              <motion.div
                initial={{
                  x: subdelta >= 0 ? '50%' : '-50%',
                  opacity: 0,
                }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  {t('preliminaries.accessibility.title')}
                </h2>

                <section className="mt-10 flex flex-col gap-4">
                  {/* Language Support */}
                  <div>
                    <p className="block text-sm font-medium leading-6 text-gray-900">
                      {t('preliminaries.accessibility.languages.title')}
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
                          {t(
                            'preliminaries.accessibility.languages.options.asl'
                          )}
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
                          {t(
                            'preliminaries.accessibility.languages.options.spanish'
                          )}
                        </label>
                      </div>

                      {/* Tele-interpreter Service */}
                      <div className="space-x-2">
                        <input
                          type="checkbox"
                          id="languageSupport.teleinterpreterLanguageService"
                          className="form-checkbox"
                          {...register(
                            'languageSupport.teleinterpreterLanguageService'
                          )}
                        />
                        <label
                          htmlFor="languageSupport.teleinterpreterLanguageService"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t(
                            'preliminaries.accessibility.languages.options.tele'
                          )}
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
                            {t(
                              'preliminaries.accessibility.languages.options.other'
                            )}
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
                      {t('preliminaries.accessibility.languages.priorNotice')}
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
                      {t('preliminaries.accessibility.ada')}
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
            )}
          </motion.div>
        )}

        {/* Services */}
        {currentStep === 2 && (
          <motion.div
            initial={{
              x: delta >= 0 ? '50%' : '-50%',
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Services Subpage */}
            {currentSubstep === 0 && (
              <motion.div
                initial={{
                  x: subdelta >= 0 ? '50%' : '-50%',
                  opacity: 0,
                }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  {t('services.title')}
                </h2>
                {screenWidth >= 1100 ? (
                  <ResizablePanelGroup
                    direction="horizontal"
                    className="rounded-lg border"
                  >
                    <ResizablePanel defaultSize={20}>
                      <div className="mt-2 flex flex-col px-4 py-2">
                        {/* Fix the height to be dynamic */}
                        <ScrollArea className="flex h-80 flex-col">
                          {getValues('services').map((service: Service) => (
                            <div key={service.id} className="flex flex-row">
                              <Button
                                onClick={() =>
                                  setServiceIdx(
                                    getValues('services').findIndex(
                                      (i) => i.id === service.id
                                    )
                                  )
                                }
                                className="m-1 flex-grow"
                                variant={
                                  getValues(`services.${serviceIdx}.id`) ===
                                  service.id
                                    ? 'default'
                                    : 'outline'
                                }
                                type="button"
                              >
                                {service.name}
                              </Button>
                              <Button
                                variant={
                                  getValues(`services.${serviceIdx}.id`) ===
                                  service.id
                                    ? 'default'
                                    : 'outline'
                                }
                                size="icon"
                                className="m-1"
                                onClick={() => delete_service(service.id)}
                                type="button"
                              >
                                <Trash2 size={20} />
                              </Button>
                            </div>
                          ))}
                        </ScrollArea>
                        <Separator className="my-2" />
                        <Button
                          className="m-1"
                          variant="outline"
                          onClick={add_service}
                          type="button"
                        >
                          <Plus size={16} className="mr-2" />
                          {t('services.ui.addService')}
                        </Button>
                      </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={80}>
                      {serviceIdx === -1 ? (
                        <div className="flex h-full items-center justify-center">
                          <p className="text-sm text-gray-600">
                            {t('services.ui.instructions.desktop')}
                          </p>
                        </div>
                      ) : (
                        /* Fix the height to be dynamic */
                        <ScrollArea className="h-96">
                          {ServicesForm()}
                        </ScrollArea>
                      )}
                    </ResizablePanel>
                  </ResizablePanelGroup>
                ) : (
                  <div className="flex flex-col">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          className="mx-4"
                          type="button"
                        >
                          {t('services.ui.mobileList')}
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="z-50">
                        <SheetHeader className="pb-2 text-3xl">
                          <SheetTitle className="text-center text-2xl">
                            {t('services.ui.mobileList')}
                          </SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col justify-center gap-2">
                          <Button
                            className="m-1"
                            variant="outline"
                            onClick={add_service}
                            type="button"
                          >
                            <Plus size={16} className="mr-2" />
                            {t('services.ui.addService')}
                          </Button>
                          <Separator className="my-2" />
                          {getValues('services').map(
                            (service: Service, idx: number) => (
                              <div key={service.id} className="flex flex-row">
                                <Button
                                  onClick={() => setServiceIdx(idx)}
                                  className="m-1 flex-grow"
                                  variant={
                                    getValues(`services.${serviceIdx}.id`) ===
                                    service.id
                                      ? 'default'
                                      : 'outline'
                                  }
                                  type="button"
                                >
                                  {service.name}
                                </Button>
                                <Button
                                  variant={
                                    getValues(`services.${serviceIdx}.id`) ===
                                    service.id
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size="icon"
                                  className="m-1"
                                  onClick={() => delete_service(service.id)}
                                  type="button"
                                >
                                  <Trash2 size={20} />
                                </Button>
                              </div>
                            )
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>
                    {serviceIdx === -1 ? (
                      <div className="flex h-full items-center justify-center p-5">
                        <p className="text-sm text-gray-600">
                          {t('services.ui.instructions.mobile')}
                        </p>
                      </div>
                    ) : (
                      ServicesForm()
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Opportunities */}
        {currentStep === 3 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Opportunities Subpage */}
            {currentSubstep === 0 && (
              <motion.div
                initial={{
                  x: subdelta >= 0 ? '50%' : '-50%',
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
                            {t(
                              'opportunities.acceptVolunteers.eligibility.title'
                            )}
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
                              {t(
                                'opportunities.acceptVolunteers.eligibility.phone'
                              )}
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
                              {errors.volunteerFields?.vol_coor_tel
                                ?.message && (
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
                                  setDonationChecked(e.target.value);
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
                        className={`${
                          donationChecked === 'false' ? 'opacity-50' : ''
                        }`}
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
                          className={`${
                            pickupChecked === 'false' ? 'opacity-50' : ''
                          }`}
                        >
                          <div className="">
                            <div className="flex flex-row items-center gap-4">
                              <label
                                htmlFor="pickup_loc"
                                className="text-base font-semibold leading-7 text-gray-900"
                              >
                                {t(
                                  'opportunities.acceptDonations.pickup.where'
                                )}
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
                                {...register(
                                  'recommendationFields.recommendation'
                                )}
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
                                {...register(
                                  'recommendationFields.recommendation'
                                )}
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
                          {errors.recommendationFields?.recommendation
                            ?.message && (
                            <p className="mt-2 text-sm text-red-400">
                              {
                                errors.recommendationFields.recommendation
                                  .message
                              }
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
                            {...register(
                              'recommendationFields.recommendations_contact'
                            )}
                            id="recommendations_contact"
                            cols={30}
                            rows={10}
                            disabled={recommendationChecked === 'false'}
                            className="mt-2 block h-28 w-full resize-none rounded-lg border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                          ></textarea>
                          <div className="mt-2 min-h-6 ">
                            {errors.recommendationFields
                              ?.recommendations_contact?.message && (
                              <p className="mt-2 text-sm text-red-400">
                                {
                                  errors.recommendationFields
                                    .recommendations_contact.message
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
            )}
          </motion.div>
        )}

        {/* Review */}
        {currentStep === 4 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Review Subpage */}
            {currentSubstep === 0 && (
              <motion.div
                initial={{
                  x: subdelta >= 0 ? '50%' : '-50%',
                  opacity: 0,
                }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="flex flex-col gap-10">
                  {/* Header */}
                  <section>
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                      {t('review.title')}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {t('review.description')}
                    </p>
                  </section>

                  {/* Preliminaries */}
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
                          <div className="flex flex-col md:flex-row md:items-start">
                            <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                              {t('preliminaries.general.name') + ':'}
                            </p>
                            <p className="w-full md:w-1/2 ">
                              {getValues('legalName')}
                            </p>
                          </div>

                          {/* AKAs */}
                          <div className="flex flex-col md:flex-row md:items-start">
                            {getValues('akas') ? (
                              <>
                                <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                                  {t('preliminaries.general.aka') + ':'}
                                </p>
                                <p className="w-full md:w-1/2 ">
                                  {getValues('akas')}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-md w-full leading-6 text-gray-400 md:w-1/2">
                                  {t('preliminaries.general.aka') + ':'}
                                </p>
                                <p className="w-full text-gray-400 md:w-1/2">
                                  N/A
                                </p>
                              </>
                            )}
                          </div>

                          {/* Legal Status */}
                          <div className="flex flex-col md:flex-row md:items-start">
                            <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                              {t('preliminaries.general.legalStatus.title') +
                                ':'}
                            </p>
                            <p className="w-full md:w-1/2 ">
                              {getValues('legalStatus')
                                .charAt(0)
                                .toUpperCase() +
                                getValues('legalStatus').slice(1)}
                            </p>
                          </div>

                          {/* Director Name */}
                          <div className="flex flex-col md:flex-row md:items-start">
                            <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                              {t('preliminaries.general.director') + ':'}
                            </p>
                            <p className="w-full md:w-1/2 ">
                              {getValues('directorName')}
                            </p>
                          </div>
                        </div>

                        {/* Second Column */}
                        <div className="flex w-full flex-col gap-2 md:w-1/3">
                          {/* Main Phone Number */}
                          <div className="flex flex-col md:flex-row md:items-start">
                            <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                              {t('preliminaries.general.phone') + ':'}
                            </p>
                            <p className="w-full md:w-1/2 ">
                              {getValues('contactInfo.phoneNumber')}
                            </p>
                          </div>

                          {/* Fax Number */}
                          <div className="flex flex-col md:flex-row md:items-start">
                            <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                              {t('preliminaries.general.fax') + ':'}
                            </p>
                            <p className="w-full md:w-1/2 ">
                              {getValues('contactInfo.faxNumber')}
                            </p>
                          </div>

                          {/* Toll Free Number */}
                          <div className="flex flex-col md:flex-row md:items-start">
                            <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                              {t('preliminaries.general.toll-free') + ':'}
                            </p>
                            <p className="w-full md:w-1/2 ">
                              {getValues('contactInfo.tollFreeNumber')}
                            </p>
                          </div>

                          {/* TDD/TTY Number */}
                          <div className="flex flex-col md:flex-row md:items-start">
                            <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                              {t('preliminaries.general.tdd-tty') + ':'}
                            </p>
                            <p className="w-full md:w-1/2 ">
                              {getValues('contactInfo.TDDTTYNumber')}
                            </p>
                          </div>
                        </div>

                        {/* Third Column */}
                        <div className="flex w-full flex-col gap-2 md:w-1/3">
                          {/* Additional Numbers */}
                          <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                            {t('review.additional.title')}
                          </p>

                          {getValues('contactInfo.additionalNumbers') ===
                          undefined ? (
                            <p className="leading-6 text-gray-400">
                              {t('review.additional.none')}
                            </p>
                          ) : (
                            <div className="max-h-24 w-full overflow-y-auto md:w-1/2 ">
                              {getValues('contactInfo.additionalNumbers')?.map(
                                (n, index) => (
                                  <div
                                    key={index}
                                    className="ml-2 grid grid-cols-2"
                                  >
                                    <p className="text-base font-medium leading-7 text-gray-900">
                                      {n.label}:
                                    </p>
                                    <p>{n.number}</p>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                          {/* Email */}
                          <div className="flex flex-col md:flex-row md:items-start">
                            <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                              {t('preliminaries.general.email') + ':'}
                            </p>
                            <p className="w-full md:w-1/2 ">
                              {getValues('contactInfo.email')}
                            </p>
                          </div>

                          {/* Website */}
                          <div className="flex flex-col md:flex-row md:items-start">
                            <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                              {t('preliminaries.general.website') + ':'}
                            </p>
                            <p className="w-full md:w-1/2 ">
                              {getValues('contactInfo.website')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Brief Agency Information */}
                      <p className="mt-8 text-base font-semibold leading-7 text-gray-900">
                        {t('preliminaries.general.agencyInfo') + ':'}
                      </p>
                      <p>{getValues('agencyInfo')}</p>
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
                            {/* TODO */}
                            <h3 className="mb-4 text-base font-semibold leading-7 text-gray-900">
                              {t('preliminaries.operations.hours')}
                            </h3>
                            <p>
                              <span className="bg-blue-500 text-white">
                                TODO: Hours of operation
                              </span>
                            </p>
                          </div>

                          {/* Funding Source */}
                          <div>
                            <h3 className="mb-4 text-base font-semibold leading-7 text-gray-900">
                              {t('preliminaries.operations.funding.title')}
                            </h3>
                            {get_fundingSource()}
                          </div>
                        </div>

                        {/* Location Information */}
                        <div className="w-full md:w-1/2">
                          <h3 className="mb-4 text-base font-semibold leading-7 text-gray-900">
                            {t('preliminaries.operations.location.title')}
                          </h3>

                          <div className="flex w-full flex-col gap-2">
                            {/* Is the physical address confidential? */}
                            <div className="flex flex-col gap-16 md:flex-row md:items-start">
                              <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                                {t(
                                  'preliminaries.operations.location.confidential'
                                )}
                              </p>
                              <p className="w-full md:w-1/2 ">
                                {getValues(
                                  'location.confidential'
                                ).toString() === 'true'
                                  ? t('options.yes')
                                  : t('options.no')}
                              </p>
                            </div>

                            {/* Physical Address */}
                            <div className="flex flex-col gap-16 md:flex-row md:items-start">
                              <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                                {t(
                                  'preliminaries.operations.location.address.physical'
                                ) + ':'}
                              </p>
                              <p className="w-full md:w-1/2 ">
                                {t('review.mailing.title')}
                              </p>
                            </div>

                            {/* Mailing Address */}
                            <div className="flex flex-col gap-16 md:flex-row md:items-start">
                              {getValues('akas') ? (
                                <>
                                  <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                                    {t('review.mailing.title')}
                                  </p>
                                  <p className="w-full md:w-1/2 ">
                                    {getValues('location.mailingAddress')}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p className="text-md w-full leading-6 text-gray-400 md:w-1/2">
                                    {t('review.mailing.title') + ':'}
                                  </p>
                                  <p className="w-full text-gray-400 md:w-1/2">
                                    {t('review.mailing.none')}
                                  </p>
                                </>
                              )}
                            </div>

                            {/* County */}
                            <div className="flex flex-col gap-16 md:flex-row md:items-start">
                              <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                                {t(
                                  'preliminaries.operations.location.address.county'
                                ) + ':'}
                              </p>
                              <p className="w-full md:w-1/2 ">
                                {getValues('location.county')}
                              </p>
                            </div>

                            {/* City */}
                            <div className="flex flex-col gap-16 md:flex-row md:items-start">
                              <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                                {t(
                                  'preliminaries.operations.location.address.city'
                                ) + ':'}
                              </p>
                              <p className="w-full md:w-1/2 ">
                                <p>{getValues('location.city')}</p>
                              </p>
                            </div>

                            {/* State */}
                            <div className="flex flex-col gap-16 md:flex-row md:items-start">
                              <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                                {t(
                                  'preliminaries.operations.location.address.state'
                                ) + ':'}
                              </p>
                              <p className="w-full md:w-1/2 ">
                                {getValues('location.state')}
                              </p>
                            </div>

                            {/* Zip Code */}
                            <div className="flex flex-col gap-16 md:flex-row md:items-start">
                              <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                                {t(
                                  'preliminaries.operations.location.address.zip'
                                ) + ':'}
                              </p>
                              <p className="w-full md:w-1/2 ">
                                {getValues('location.zipCode')}
                              </p>
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
                          <h3 className="mb-4 w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                            {t('preliminaries.additional.serviceArea.title')}
                          </h3>

                          <div className="flex flex-col gap-2">
                            {/* Specific Town/City */}
                            {getValues('serviceArea.townCity') != '' && (
                              <div className="flex flex-col md:flex-row md:items-start">
                                <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                                  {t(
                                    'preliminaries.additional.serviceArea.town-city'
                                  ) + ':'}
                                </p>
                                <p className="w-full md:w-1/2 ">
                                  {getValues('serviceArea.townCity')}
                                </p>
                              </div>
                            )}

                            {/* Specific Zip Codes */}
                            {getValues('serviceArea.zipCodes').length != 0 && (
                              <div className="flex flex-col md:flex-row md:items-start">
                                <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                                  {t(
                                    'preliminaries.additional.serviceArea.zip'
                                  ) + ':'}
                                </p>
                                <p className="w-full md:w-1/2">
                                  {convertToString(
                                    getValues('serviceArea.zipCodes')
                                  )}
                                </p>
                              </div>
                            )}

                            {/* Specific Counties */}
                            {getValues('serviceArea.counties').length != 0 && (
                              <div className="flex flex-col md:flex-row md:items-start">
                                <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                                  {t(
                                    'preliminaries.additional.serviceArea.county'
                                  ) + ':'}
                                </p>
                                <p className="w-full md:w-1/2">
                                  {convertToString(
                                    getValues('serviceArea.counties')
                                  )}
                                </p>
                              </div>
                            )}

                            {/* Statewide */}
                            {getValues('serviceArea.statewide') && (
                              <div className="flex flex-col md:flex-row md:items-start">
                                <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                                  {t(
                                    'preliminaries.additional.serviceArea.state'
                                  ) + ':'}
                                </p>
                                <p className="w-full md:w-1/2 ">
                                  {getValues('serviceArea.statewide') && 'Yes'}
                                </p>
                              </div>
                            )}

                            {/* Nationwide */}
                            {getValues('serviceArea.nationwide') && (
                              <div className="flex flex-col md:flex-row md:items-start">
                                <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                                  {t(
                                    'preliminaries.additional.serviceArea.nation'
                                  ) + ':'}
                                </p>
                                <p className="w-full md:w-1/2 ">
                                  {getValues('serviceArea.nationwide') && 'Yes'}
                                </p>
                              </div>
                            )}

                            {/* Other */}
                            {getValues('serviceArea.other') != '' && (
                              <div className="flex flex-col md:flex-row md:items-start">
                                <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                                  {t(
                                    'preliminaries.additional.serviceArea.other'
                                  ) + ':'}
                                </p>
                                <p className="w-full md:w-1/2 ">
                                  {getValues('serviceArea.other')}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Annual Agency Update */}
                        <div className="md:w-1/2">
                          <h3 className="mb-4 text-base font-semibold leading-7 text-gray-900">
                            {t('preliminaries.additional.agencyUpdate.title')}
                          </h3>

                          <div className="flex w-full flex-col gap-2">
                            {/* Name */}
                            <div className="flex flex-col gap-16 md:flex-row md:items-start">
                              <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                                {t(
                                  'preliminaries.additional.agencyUpdate.name'
                                ) + ':'}
                              </p>
                              <p className="w-full md:w-1/2 ">
                                {getValues('annualAgencyUpdate.name')}
                              </p>
                            </div>

                            {/* Title */}
                            <div className="flex flex-col gap-16 md:flex-row md:items-start">
                              <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                                {t(
                                  'preliminaries.additional.agencyUpdate.contactTitle'
                                ) + ':'}
                              </p>
                              <p className="w-full md:w-1/2 ">
                                {getValues('annualAgencyUpdate.title')}
                              </p>
                            </div>

                            {/* Phone Number */}
                            <div className="flex flex-col gap-16 md:flex-row md:items-start">
                              <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                                {t(
                                  'preliminaries.additional.agencyUpdate.phone'
                                ) + ':'}
                              </p>
                              <p className="w-full md:w-1/2 ">
                                <p>
                                  {getValues('annualAgencyUpdate.phoneNumber')}
                                </p>
                              </p>
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-16 md:flex-row md:items-start">
                              <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                                {t(
                                  'preliminaries.additional.agencyUpdate.email'
                                ) + ':'}
                              </p>
                              <p className="w-full md:w-1/2 ">
                                {getValues('annualAgencyUpdate.email')}
                              </p>
                            </div>

                            {/* Would you like this information to be hidden from the website? */}
                            <div className="flex flex-col gap-16 md:flex-row md:items-end">
                              <p className="w-full text-base font-semibold leading-7 text-gray-900 md:w-1/2">
                                {t(
                                  'preliminaries.additional.agencyUpdate.confidential'
                                )}
                              </p>
                              <p className="w-full md:w-1/2 ">
                                {getValues(
                                  'annualAgencyUpdate.hideFromWebsite'
                                ).toString() === 'true'
                                  ? t('options.yes')
                                  : t('options.no')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </section>

                  <hr />

                  {/* Accessibility */}
                  <section>
                    <h2 className="mb-4 text-base font-semibold leading-7 text-gray-900 underline underline-offset-2">
                      {t('preliminaries.accessibility.title')}
                    </h2>

                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="w-full text-base font-semibold leading-7 text-gray-900">
                          {t('preliminaries.accessibility.languages.title')}
                        </p>
                        <p>{get_accessibility_langs()}</p>
                      </div>

                      <div>
                        <p className="w-full text-base font-semibold leading-7 text-gray-900">
                          {t(
                            'preliminaries.accessibility.languages.priorNotice'
                          )}
                        </p>
                        <p>
                          {getValues('supportedLanguagesWithoutNotice')
                            .length != 0
                            ? convertToString(
                                getValues('supportedLanguagesWithoutNotice')
                              )
                            : 'No'}
                        </p>
                      </div>

                      <div className="flex flex-row items-center gap-4">
                        <p className="text-base font-semibold leading-7 text-gray-900">
                          {t('preliminaries.accessibility.ada')}
                        </p>
                        <p>
                          {getValues('accessibilityADA').toString() === 'true'
                            ? t('options.yes')
                            : t('options.no')}
                        </p>
                      </div>
                    </div>
                  </section>

                  <hr />

                  {/* Services */}
                  <section>
                    <h2 className="mb-4 text-base font-semibold leading-7 text-gray-900 underline underline-offset-2">
                      {t('services.title')}
                    </h2>

                    {screenWidth < 720 || getValues('services').length > 2 ? (
                      <Carousel
                        opts={{
                          align: 'start',
                        }}
                      >
                        <CarouselContent>{get_services()}</CarouselContent>
                        <CarouselNext
                          className="right-1/3 top-full mt-8 sm:-right-12 sm:top-1/2 sm:-translate-y-1/2"
                          type="button"
                        />
                        <CarouselPrevious
                          className="left-1/3 top-full mt-8 sm:-left-12 sm:top-1/2 sm:-translate-y-1/2"
                          type="button"
                        />
                      </Carousel>
                    ) : getValues('services').length == 0 ? (
                      <p className="text-md leading-6 text-gray-400">
                        {t('review.no-services')}
                      </p>
                    ) : (
                      <div className="flex w-full flex-col gap-4 md:flex-row">
                        {get_services()}
                      </div>
                    )}
                  </section>

                  <hr />

                  {/* Opportunities */}
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
                            {getValues('volunteerFields.volunteers') == 'true'
                              ? t('options.yes')
                              : t('options.no')}
                          </p>
                        </div>

                        {getValues('volunteerFields.volunteers') == 'true' && (
                          <div>
                            <div className="flex flex-col sm:flex-row sm:gap-16">
                              <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                                <CornerDownRight className="mr-1" />
                                {t(
                                  'opportunities.acceptVolunteers.eligibility.title'
                                )}
                              </p>

                              <p className="sm:w-1/2">
                                {getValues('volunteerFields.vol_reqs')}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:gap-16">
                              <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                                <CornerDownRight className="mr-1" />
                                {t(
                                  'opportunities.acceptVolunteers.eligibility.coordinator'
                                )}
                              </p>

                              <p className="sm:w-1/2">
                                {getValues('volunteerFields.vol_coor')}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:gap-16">
                              <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                                <CornerDownRight className="mr-1" />
                                {t(
                                  'opportunities.acceptVolunteers.eligibility.phone'
                                )}
                              </p>

                              <p className="sm:w-1/2">
                                {getValues('volunteerFields.vol_coor_tel')}
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
                            {getValues('donationFields.donation') == 'true'
                              ? t('options.yes')
                              : t('options.no')}
                          </p>
                        </div>

                        {getValues('donationFields.donation') == 'true' && (
                          <div>
                            <div className="flex flex-col sm:flex-row sm:gap-16">
                              <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                                <CornerDownRight className="mr-1" />
                                {t('opportunities.acceptDonations.list.title')}
                              </p>

                              <p className="sm:w-1/2">
                                {getValues('donationFields.don_ex')}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:gap-16">
                              <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                                <CornerDownRight className="mr-1" />
                                {t(
                                  'opportunities.acceptDonations.pickup.title'
                                )}
                              </p>

                              <p className="sm:w-1/2">
                                {getValues('donationFields.pickup') == 'true'
                                  ? t('options.yes')
                                  : t('options.no')}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:gap-16">
                              <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                                <CornerDownRight className="ml-6 mr-1" />
                                {t(
                                  'opportunities.acceptDonations.pickup.where'
                                )}
                              </p>

                              <p className="ml-6 flex sm:ml-0 sm:w-1/2">
                                {getValues('donationFields.pickup_loc')}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:gap-16">
                              <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                                <CornerDownRight className="mr-1" />
                                {t('opportunities.acceptDonations.coordinator')}
                              </p>

                              <p className="sm:w-1/2">
                                {getValues('donationFields.don_coor')}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:gap-16">
                              <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                                <CornerDownRight className="mr-1" />
                                {t('opportunities.acceptDonations.phone')}
                              </p>
                              <p className="sm:w-1/2">
                                {getValues('donationFields.don_coor_tel')}
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
                            {getValues('recommendationFields.recommendation') ==
                            'true'
                              ? t('options.yes')
                              : t('options.no')}
                          </p>
                        </div>

                        {getValues('recommendationFields.recommendation') ==
                          'true' && (
                          <div className="flex flex-col sm:flex-row sm:gap-16">
                            <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                              <CornerDownRight className="mr-1" />
                              {t('opportunities.other.contactInformation')}
                            </p>

                            <p className="sm:w-1/2">
                              {getValues(
                                'recommendationFields.recommendations_contact'
                              )}
                            </p>
                          </div>
                        )}
                      </section>
                    </section>
                  </section>
                </div>

                <Button type="submit" className="h-10 w-36">
                  {isLoading ? (
                    <Spinner className="h-4 w-4 animate-spin" />
                  ) : (
                    <p>{t('review.button')}</p>
                  )}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </form>

      {/* Navigation */}
      <div className="mt-8 pt-5">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={currentStep === 0 && currentSubstep == 0}
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            disabled={
              currentStep === steps.length - 1 &&
              currentSubstep === steps[currentStep].subpages.length
            }
            className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>
      <Footer className="pb-2 pt-6" />
    </section>
  );
}
