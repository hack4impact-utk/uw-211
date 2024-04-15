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
import { convertToArray } from '@/utils/convertToArray';

type Inputs = z.infer<typeof FormDataSchema>;
type Service = z.infer<typeof ServiceSchema>;

const steps = formSteps;

export default function Form({ params }: { params: { id: string } }) {
  const [previousStep, setPreviousStep] = useState(-1);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubstep, setCurrentSubstep] = useState(0);
  const [previousSubstep, setPreviousSubstep] = useState(-1);
  const delta = currentStep - previousStep;
  const subdelta = currentSubstep - previousSubstep;

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
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

  const processForm: SubmitHandler<Inputs> = (data) => {
    const validatedInfo = zodFormToTs(data);
    createAgencyInfoWithServices(params.id, validatedInfo);
    reset();
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

  const [isMondayChecked, setMondayChecked] = useState(false);
  const [isTuesdayChecked, setTuesdayChecked] = useState(false);
  const [isWednesdayChecked, setWednesdayChecked] = useState(false);
  const [isThursdayChecked, setThursdayChecked] = useState(false);
  const [isFridayChecked, setFridayChecked] = useState(false);
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
      name: `New Service #${getValues('services').length + 1}`,
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
          Name
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
          Full Description
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
          Contact Person
        </label>
        <Input
          id="contact"
          className="mb-2"
          placeholder="Only add contact person if different from Director or if contact persons differ by service."
          {...register(`services.${serviceIdx}.contactPersonName`)}
        />

        {/* hours here eventually */}
        <label
          htmlFor="hours"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Hours
        </label>
        <div className="mb-2">
          <p className="text-sm leading-6 text-gray-600">TBD...</p>
        </div>

        <label
          htmlFor="eligibility"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Eligibility Requirements
        </label>
        <Textarea
          id="eligibility"
          className="mb-2"
          placeholder="Who is eligible for this service? Who is the population the service is trying to serve?
It is okay to restrict services to certain populations based on gender; family status, disability,
age, personal situations, etc. (i.e. battered women with children, people with visual impairments,
homeless men, etc.) This helps us to make appropriate referrals."
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
          Application Process
        </label>
        <p className="text-sm leading-6 text-gray-600">
          How would someone apply for this service?
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
              Walk-in
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
              Telephone
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
              Call to Schedule an Appointment
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
              Apply Online
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
              Other
            </label>
            {watch(
              `services.${serviceIdx}.applicationProcess.other.selected`
            ) ? (
              <>
                <Input
                  className="m-2"
                  placeholder="Please specify."
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
              Referral Required
            </label>
            {watch(
              `services.${serviceIdx}.applicationProcess.referral.required`
            ) ? (
              <>
                <Input
                  className="m-2"
                  placeholder="By whom?"
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
          Fees
        </label>
        <p className="text-sm leading-6 text-gray-600">
          Are individuals charged for your services? What is your fee structure?
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
              No Fees
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
              Straight Fee
            </label>
            {watch(`services.${serviceIdx}.feeCategory.straight.selected`) ? (
              <>
                <Input
                  className="m-2"
                  placeholder="Please specify."
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
              Sliding Scale Fee
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
              Medicaid/TennCare
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
              Medicare
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
              Private Insurance
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
          Required Documents
        </label>
        <p className="text-sm leading-6 text-gray-600">
          What would someone need to bring when applying?
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
              No Documents
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
              State Issued ID
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
              Social Security Card
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
              Proof of Residence
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
              Proof of Income
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
              Birth Certificate
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
              Medical Records
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
              Psych Records
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
              Proof of Need
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
              Utility Bill
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
              Utility Cutoff Notice
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
              Proof of Citizenship
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
              Proof of Public Assistance
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
              Driver&apos;s License
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
              Other
            </label>
            {watch(
              `services.${serviceIdx}.requiredDocuments.other.selected`
            ) ? (
              <>
                <Input
                  className="m-2"
                  placeholder="Please specify."
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

  const PreliminariesHeader = (data: { name: string }) => {
    return (
      <>
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Preliminaries - {data.name}
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Let&apos;s get to know your agency...
        </p>
      </>
    );
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
                <PreliminariesHeader
                  name={steps[currentStep].subpages[currentSubstep].name}
                />

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
                          Legal Agency Name
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
                          Also known as
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
                          Legal Organizational Status
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
                            <option value="">Please Select One</option>
                            <option value="federal">Federal</option>
                            <option value="state">State</option>
                            <option value="county">County</option>
                            <option value="city">City</option>
                            <option value="non-profit">Non-profit</option>
                            <option value="501(c)3">501(c)3</option>
                            <option value="For profit">For profit</option>
                            <option value="other">Other</option>
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
                          Director Name/Title
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
                        Brief Agency Information
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
                            Main Phone Number
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
                            Fax Number
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
                            Toll Free Number
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
                            TDD/TTY Number
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

                      <div>
                        <span className="bg-blue-500 text-white">
                          TODO: Additional Numbers
                        </span>
                      </div>

                      {/* contactInfo.email */}
                      <div>
                        <label
                          htmlFor="contactInfo.email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Email
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
                          Website
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
                  name={steps[currentStep].subpages[currentSubstep].name}
                />

                <section className="mt-10 flex flex-col md:flex-row">
                  {/* Left */}
                  <section className="flex w-full flex-col md:w-1/2">
                    {/* Hours of Operation */}
                    <div>
                      <div>
                        <h3 className="block text-sm font-medium leading-6 text-gray-900">
                          Hours of Operation
                        </h3>
                        <div className="mt-2">
                          <fieldset>
                            <label
                              htmlFor="days"
                              className="mb-2 block text-sm font-medium leading-6 text-gray-900"
                            >
                              Select day(s) of operation
                              <span className="ml-1 text-sm text-red-400">
                                *
                              </span>
                            </label>

                            <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
                              <div className="flex flex-row gap-2">
                                {/* Monday */}
                                <label>
                                  <input
                                    type="checkbox"
                                    id="monday"
                                    className="form-checkbox hidden"
                                    checked={isMondayChecked}
                                    {...register('days.monday', {
                                      onChange: () => {
                                        setMondayChecked(!isMondayChecked);
                                      },
                                    })}
                                  />
                                  <span
                                    className={
                                      isMondayChecked
                                        ? 'w-18 rounded-sm bg-sky-600 px-2 py-1 text-white'
                                        : 'w-18 rounded-sm bg-slate-200 px-2 py-1  text-gray-900'
                                    }
                                  >
                                    Monday
                                  </span>
                                </label>

                                {/* Tuesday */}
                                <label>
                                  <input
                                    type="checkbox"
                                    id="tuesday"
                                    className="form-checkbox hidden"
                                    checked={isTuesdayChecked}
                                    {...register('days.tuesday', {
                                      onChange: () => {
                                        setTuesdayChecked(!isTuesdayChecked);
                                      },
                                    })}
                                  />
                                  <span
                                    className={
                                      isTuesdayChecked
                                        ? 'w-18 rounded-sm bg-sky-600 px-2 py-1 text-white'
                                        : 'w-18 rounded-sm bg-slate-200 px-2 py-1  text-gray-900'
                                    }
                                  >
                                    Tuesday
                                  </span>
                                </label>

                                {/* Wednesday */}
                                <label>
                                  <input
                                    type="checkbox"
                                    id="wednesday"
                                    className="form-checkbox hidden"
                                    checked={isWednesdayChecked}
                                    {...register('days.wednesday', {
                                      onChange: () => {
                                        setWednesdayChecked(
                                          !isWednesdayChecked
                                        );
                                      },
                                    })}
                                  />
                                  <span
                                    className={
                                      isWednesdayChecked
                                        ? 'w-18 rounded-sm bg-sky-600 px-2 py-1 text-white'
                                        : 'w-18 rounded-sm bg-slate-200 px-2 py-1  text-gray-900'
                                    }
                                  >
                                    Wednesday
                                  </span>
                                </label>
                              </div>

                              <div className="flex flex-row gap-2">
                                {/* Thursday */}
                                <label>
                                  <input
                                    type="checkbox"
                                    id="thursday"
                                    className="form-checkbox hidden"
                                    checked={isThursdayChecked}
                                    {...register('days.thursday', {
                                      onChange: () => {
                                        setThursdayChecked(!isThursdayChecked);
                                      },
                                    })}
                                  />
                                  <span
                                    className={
                                      isThursdayChecked
                                        ? 'w-18 rounded-sm bg-sky-600 px-2 py-1 text-white'
                                        : 'w-18 rounded-sm bg-slate-200 px-2 py-1  text-gray-900'
                                    }
                                  >
                                    Thursday
                                  </span>
                                </label>

                                {/* Friday */}
                                <label>
                                  <input
                                    type="checkbox"
                                    className="form-checkbox hidden"
                                    id="friday"
                                    checked={isFridayChecked}
                                    {...register('days.friday', {
                                      onChange: () => {
                                        setFridayChecked(!isFridayChecked);
                                      },
                                    })}
                                  />
                                  <span
                                    className={
                                      isFridayChecked
                                        ? 'w-18 rounded-sm bg-sky-600 px-2 py-1 text-white'
                                        : 'w-18 rounded-sm bg-slate-200 px-2 py-1  text-gray-900'
                                    }
                                  >
                                    Friday
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div className="mt-2 min-h-6 ">
                              {errors.days?.message && (
                                <p className="mt-2 text-sm text-red-400">
                                  {errors.days.message}
                                </p>
                              )}
                            </div>
                          </fieldset>
                        </div>
                      </div>

                      {/* Open/Close */}
                      <div className="flex w-full flex-row items-center gap-4 md:w-5/6">
                        {/* Open */}
                        <div>
                          <label
                            htmlFor="open"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Open
                            <span className="ml-1 text-sm text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            id="open"
                            {...register('hours.open')}
                            autoComplete="open"
                            className="block h-10 w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                          />
                          <div className="mt-2 min-h-6 ">
                            {errors.hours?.open?.message && (
                              <p className="mt-2 text-sm text-red-400">
                                {errors.hours.open.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="mt-4">to</p>
                        {/* Close */}
                        <div>
                          <label
                            htmlFor="close"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Close
                            <span className="ml-1 text-sm text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            id="close"
                            {...register('hours.close')}
                            autoComplete="close"
                            className="block h-10 w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600  sm:text-sm sm:leading-6"
                          />
                          <div className="mt-2 min-h-6 ">
                            {errors.hours?.close?.message && (
                              <p className="mt-2 text-sm text-red-400">
                                {errors.hours.close.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Funding Sources */}
                    <div className="mt-8">
                      <h3 className="mb-2 block text-sm font-medium leading-6 text-gray-900">
                        Funding Sources
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
                              Federal
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
                              State
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
                              County
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
                              City
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
                              Donations
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
                              Foundations/Private Org.
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
                              Fees/Dues
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
                              United Way
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
                              Other
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
                        Location Information
                      </h3>
                      {/* location.confidential */}
                      <div>
                        <label
                          htmlFor="location.confidential"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Is the physical address confidential?
                          <span className="ml-1 text-sm text-red-400">*</span>
                        </label>
                        <div className="flex flex-row gap-4 whitespace-nowrap">
                          <div>
                            <input
                              id="location.confidential"
                              type="radio"
                              value=""
                              {...register('location.confidential')}
                              autoComplete="location.confidential"
                              className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                              defaultChecked
                            />
                            <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                              No
                            </label>
                          </div>
                          <div>
                            <input
                              id="location.confidential"
                              type="radio"
                              value="true"
                              {...register('location.confidential')}
                              autoComplete="location.confidential"
                              className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <label className="ms-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                              Yes
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
                          Physical Address
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
                          Mailing Address (Only list if different from
                          Physical.)
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
                          County
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
                            City
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
                            State
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
                            Zip Code
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
                  name={steps[currentStep].subpages[currentSubstep].name}
                />

                <section className="mt-10 flex w-full flex-col gap-4 md:flex-row">
                  {/* Left */}
                  <section className="w-full md:w-1/2">
                    {/* Service Area */}
                    <div>
                      <div className="mb-4">
                        <h3 className="block text-sm font-medium leading-6 text-gray-900">
                          Service Area
                          <span className="ml-1 text-sm text-red-400">*</span>
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                          Choose the description that best reflects your service
                          area.
                        </p>
                      </div>

                      <div className="flex flex-col gap-8">
                        {/* serviceArea.townCity */}
                        <div>
                          <label
                            htmlFor="serviceArea.townCity"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Specific Town/City
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
                            Specific Zip Code(s)
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
                            Specific County/Counties
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
                        <div className="flex flex-col items-center gap-4 md:flex-row">
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
                              Statewide
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
                              Nationwide
                            </label>
                          </div>

                          <label
                            htmlFor="serviceArea.other"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Other
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
                          Annual Agency Update
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                          Provide a person we can contact for our annual
                          information update.
                        </p>
                      </div>

                      <div className="flex flex-row gap-2 md:gap-4">
                        {/* annualAgencyUpdate.name */}
                        <div className="w-2/3">
                          <label
                            htmlFor="annualAgencyUpdate.name"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Name
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
                            Title
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
                          Phone Number
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
                          Email
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
                        <label
                          htmlFor="annualAgencyUpdate.hideFromWebsite"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Would you like this information to be hidden from the
                          website?
                          <span className="ml-1 text-sm text-red-400">*</span>
                        </label>
                        <div className="flex flex-row gap-4 whitespace-nowrap">
                          <div>
                            <input
                              id="annualAgencyUpdate.hideFromWebsite"
                              type="radio"
                              value=""
                              {...register(
                                'annualAgencyUpdate.hideFromWebsite'
                              )}
                              autoComplete="annualAgencyUpdate.hideFromWebsite"
                              className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                              defaultChecked
                            />
                            <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                              No
                            </label>
                          </div>
                          <div>
                            <input
                              id="annualAgencyUpdate.hideFromWebsite"
                              type="radio"
                              value="true"
                              {...register(
                                'annualAgencyUpdate.hideFromWebsite'
                              )}
                              autoComplete="annualAgencyUpdate.hideFromWebsite"
                              className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <label className="ms-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                              Yes
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
                  Accessibility
                </h2>

                <div className="mt-10 flex w-full flex-col gap-4 lg:flex-row">
                  <p>
                    Teleinterpreter Language Service, Supported Languages,
                    Supported Languages Without Notice, Accessibility ADA
                  </p>
                </div>
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
                  Services
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
                          Add Service
                        </Button>
                      </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={80}>
                      {serviceIdx === -1 ? (
                        <div className="flex h-full items-center justify-center">
                          <p className="text-sm text-gray-600">
                            Add or select a service to begin.
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
                          Services List
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="z-50">
                        <SheetHeader className="pb-2 text-3xl">
                          <SheetTitle className="text-center text-2xl">
                            Services List
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
                            Add Service
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
                          Open the services list to begin.
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
                            Does your organization accept volunteers?
                            <span className="ml-1 text-sm text-red-400">*</span>
                          </h2>
                          {/* radio button */}
                          <div className="flex flex-row gap-4 whitespace-nowrap">
                            <div>
                              <input
                                id="volunteers"
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
                              <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                No
                              </label>
                            </div>
                            <div>
                              <input
                                id="volunteers"
                                type="radio"
                                value="true"
                                {...register('volunteerFields.volunteers')}
                                onChange={(e) => {
                                  setVolunteerChecked(e.target.value);
                                }}
                                autoComplete="volunteers"
                                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                              />
                              <label className="ms-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Yes
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
                          <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Who is eligible to volunteer?
                          </h2>
                          <textarea
                            id="vol_reqs"
                            {...register('volunteerFields.vol_reqs')}
                            autoComplete="vol_reqs"
                            cols={30}
                            rows={10}
                            disabled={volunteerChecked === 'false'}
                            placeholder="List type of volunteer work, age, training, background checks, other requirements for your volunteers"
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
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                              Volunteer Coordinator:
                            </h2>

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
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                              Phone #:
                            </h2>

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
                            Does your organization accept ongoing, non-monetary
                            donations in support of programs or services?
                            <span className="ml-1 text-sm text-red-400">*</span>
                          </h2>
                          {/* radio button */}
                          <div className="flex flex-row gap-4 whitespace-nowrap">
                            <div>
                              <input
                                id="donation"
                                type="radio"
                                value="false"
                                {...register('donationFields.donation')}
                                onChange={(e) => {
                                  setDonationChecked(e.target.value);
                                }}
                                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                defaultChecked
                              />
                              <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                No
                              </label>
                            </div>
                            <div>
                              <input
                                id="donation"
                                type="radio"
                                value="true"
                                {...register('donationFields.donation')}
                                onChange={(e) => {
                                  setDonationChecked(e.target.value);
                                }}
                                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                              />
                              <label className="ms-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Yes
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
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                              Please list.
                            </h2>
                            <input
                              type="text"
                              {...register('donationFields.don_ex')}
                              id="don_ex"
                              placeholder="Example: pet food, clothing, appliances, furniture"
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
                              Do you provide pick-up service?
                            </h2>
                            <div className="flex flex-row gap-4 whitespace-nowrap">
                              <div>
                                <input
                                  id="pickup"
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
                                <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                  No
                                </label>
                              </div>
                              <div>
                                <input
                                  id="pickup"
                                  type="radio"
                                  value="true"
                                  disabled={donationChecked === 'false'}
                                  {...register('donationFields.pickup')}
                                  onChange={(e) => {
                                    setPickupChecked(e.target.value);
                                  }}
                                  className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                />
                                <label className="ms-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                                  Yes
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
                              <h2 className="text-base font-semibold leading-7 text-gray-900">
                                Where?
                              </h2>
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
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                              Donation Coordinator:
                            </h2>

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
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                              Phone #:
                            </h2>

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
                            Are there other agencies or services that have been
                            helpful that you would recommend to be included in
                            our resource database?
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
                                No
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
                                Yes
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
                          <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Please provide contact information for these
                            agencies/services.
                          </h2>
                          <textarea
                            {...register(
                              'recommendationFields.recommendations_contact'
                            )}
                            id="recommendations_contact"
                            cols={30}
                            rows={10}
                            disabled={recommendationChecked === 'false'}
                            placeholder="List type of volunteer work, age, traning, background checks, other requirements for your volunteers"
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
                      Review
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Please review your selections and submit.
                    </p>
                  </section>

                  {/* Preliminaries */}
                  <section className="flex flex-col">
                    <h2 className="mb-4 text-base font-semibold leading-7 text-gray-900">
                      Preliminaries
                    </h2>

                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-12">
                      {/* Prelim Info */}
                      <section className="flex flex-col gap-2 sm:w-1/2">
                        <div className="flex flex-col sm:flex-row">
                          <p className="sm:w-1/2">
                            <span className="text-base font-semibold leading-7 text-gray-900">
                              Legal Name:
                            </span>{' '}
                            {getValues('legalName')}
                          </p>

                          {getValues('akas') ? (
                            <p className="sm:w-1/2">
                              <span className="text-base font-semibold leading-7 text-gray-900">
                                Also Known As:
                              </span>{' '}
                              {getValues('akas')}
                            </p>
                          ) : (
                            <p className="text-md leading-6 text-gray-400 sm:w-1/2">
                              Also Known As: N/A
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row">
                          <p className="sm:w-1/2">
                            <span className="text-base font-semibold leading-7 text-gray-900">
                              Legal Status:
                            </span>{' '}
                            {getValues('legalStatus').charAt(0).toUpperCase() +
                              getValues('legalStatus').slice(1)}
                          </p>

                          <p className="sm:w-1/2">
                            <span className="text-base font-semibold leading-7 text-gray-900">
                              Director Name:
                            </span>{' '}
                            {getValues('directorName')}
                          </p>
                        </div>

                        <p className="text-base font-semibold leading-7 text-gray-900">
                          Brief Agency Information
                        </p>
                        <p>{getValues('agencyInfo')}</p>
                      </section>

                      {/* Hours of Operation */}
                      <section className="w-1/2">
                        {/* TODO */}
                        <h3 className="text-base font-semibold leading-7 text-gray-900">
                          Hours of Operation
                        </h3>
                        <p>
                          <span className="bg-blue-500 text-white">
                            TODO: Hours of operation
                          </span>
                        </p>
                      </section>
                    </div>
                  </section>

                  {/* Services */}
                  <section>
                    <h2 className="mb-4 text-base font-semibold leading-7 text-gray-900">
                      Services
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
                        No services listed.
                      </p>
                    ) : (
                      <div className="flex w-full flex-col gap-4 md:flex-row">
                        {get_services()}
                      </div>
                    )}
                  </section>

                  {/* Opportunities */}
                  <section className="mt-8 flex flex-col gap-4 sm:mt-0">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                      Opportunities
                    </h2>

                    <section className="flex flex-col gap-8">
                      {/* Volunteers */}
                      <section>
                        <div className="flex flex-col sm:flex-row sm:gap-16">
                          <p className="text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                            Does your organization accept volunteers?
                          </p>

                          <p className="sm:w-1/2">
                            {getValues('volunteerFields.volunteers') == 'true'
                              ? 'Yes'
                              : 'No'}
                          </p>
                        </div>

                        {getValues('volunteerFields.volunteers') == 'true' && (
                          <div>
                            <div className="flex flex-col sm:flex-row sm:gap-16">
                              <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                                <CornerDownRight className="mr-1" />
                                Who is eligible to volunteer?
                              </p>

                              <p className="sm:w-1/2">
                                {getValues('volunteerFields.vol_reqs')}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:gap-16">
                              <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                                <CornerDownRight className="mr-1" />
                                Volunteer Coordinator
                              </p>

                              <p className="sm:w-1/2">
                                {getValues('volunteerFields.vol_coor')}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:gap-16">
                              <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                                <CornerDownRight className="mr-1" />
                                Phone #
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
                            Does your organization accept ongoing, non-monetary
                            donations in support of programs or services?
                          </p>

                          <p className="sm:w-1/2">
                            {getValues('donationFields.donation') == 'true'
                              ? 'Yes'
                              : 'No'}
                          </p>
                        </div>

                        {getValues('donationFields.donation') == 'true' && (
                          <div>
                            <div className="flex flex-col sm:flex-row sm:gap-16">
                              <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                                <CornerDownRight className="mr-1" />
                                Please list.
                              </p>

                              <p className="sm:w-1/2">
                                {getValues('donationFields.don_ex')}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:gap-16">
                              <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                                <CornerDownRight className="mr-1" />
                                Do you provide pick-up service?
                              </p>

                              <p className="sm:w-1/2">
                                {getValues('donationFields.pickup') == 'true'
                                  ? 'Yes'
                                  : 'No'}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:gap-16">
                              <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                                <CornerDownRight className="ml-6 mr-1" />
                                Where?
                              </p>

                              <p className="ml-6 flex sm:ml-0 sm:w-1/2">
                                {getValues('donationFields.pickup_loc')}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:gap-16">
                              <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                                <CornerDownRight className="mr-1" />
                                Donation Coordinator
                              </p>

                              <p className="sm:w-1/2">
                                {getValues('donationFields.don_coor')}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:gap-16">
                              <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                                <CornerDownRight className="mr-1" />
                                Phone #
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
                            Are there other agencies or services that have been
                            helpful that you would recommend to be included in
                            our resource database?
                          </p>

                          <p className="sm:w-1/2">
                            {getValues('recommendationFields.recommendation') ==
                            'true'
                              ? 'Yes'
                              : 'No'}
                          </p>
                        </div>

                        {getValues('recommendationFields.recommendation') ==
                          'true' && (
                          <div className="flex flex-col sm:flex-row sm:gap-16">
                            <p className="flex text-base font-semibold leading-7 text-gray-900 sm:w-1/2">
                              <CornerDownRight className="mr-1" />
                              Please provide contact information for these
                              agencies/services.
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
                <Button type="submit">Click to Submit</Button>
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
