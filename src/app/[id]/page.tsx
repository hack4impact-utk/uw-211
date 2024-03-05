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
import { Plus, Trash2 } from 'lucide-react';
import FormStepper from '@/components/FormStepper';
import HoursOfOperationPicker from '@/components/HoursOfOperationPicker';
import { useWindowSize } from '@/utils/hooks/useWindowSize';
import {
  Sheet,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetContent,
} from '@/components/ui/sheet';
import { useBeforeUnload } from '@/utils/hooks/useBeforeUnload';
import { formSteps } from '@/utils/constants/formSteps';

type Inputs = z.infer<typeof FormDataSchema>;
type Service = z.infer<typeof ServiceSchema>;

const steps = formSteps;

export default function Form({ params }: { params: { id: string } }) {
  const [previousStep, setPreviousStep] = useState(-1);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;

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
    console.log('Form data for agency with id', params.id);
    console.log(data);
    reset();
  };

  type FieldName = keyof Inputs;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length) {
      if (currentStep === steps.length - 1) {
        await handleSubmit(processForm)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
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
      name: `New Service #${getValues('services').length + 1}`,
      id: Date.now(),
      contact: '',
      description: '',
      eligibility: '',
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
      fees: {
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
        {errors.services?.[serviceIdx]?.name?.message && (
          <p className="mt-2 text-sm text-red-400">
            {errors.services[serviceIdx]?.name?.message}
          </p>
        )}

        <label
          htmlFor="description"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Full Description
        </label>
        <Textarea
          id="description"
          className="mb-2"
          {...register(`services.${serviceIdx}.description`)}
        />
        {errors.services?.[serviceIdx]?.description?.message && (
          <p className="mt-2 text-sm text-red-400">
            {errors.services[serviceIdx]?.description?.message}
          </p>
        )}

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
          {...register(`services.${serviceIdx}.contact`)}
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
          {...register(`services.${serviceIdx}.eligibility`)}
        />
        {errors.services?.[serviceIdx]?.eligibility?.message && (
          <p className="mt-2 text-sm text-red-400">
            {errors.services[serviceIdx]?.eligibility?.message}
          </p>
        )}

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
                {errors.services?.[serviceIdx]?.applicationProcess?.other
                  ?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {
                      errors.services[serviceIdx]?.applicationProcess?.other
                        ?.message
                    }
                  </p>
                )}
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
                {errors.services?.[serviceIdx]?.applicationProcess?.referral
                  ?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {
                      errors.services[serviceIdx]?.applicationProcess?.referral
                        ?.message
                    }
                  </p>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        {errors.services?.[serviceIdx]?.applicationProcess?.message && (
          <p className="mt-2 text-sm text-red-400">
            {errors.services[serviceIdx]?.applicationProcess?.message}
          </p>
        )}

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
              {...register(`services.${serviceIdx}.fees.none`)}
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
              {...register(`services.${serviceIdx}.fees.straight.selected`)}
              disabled={watch(`services.${serviceIdx}.fees.none`)}
            />
            <label
              htmlFor="straight"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Straight Fee
            </label>
            {watch(`services.${serviceIdx}.fees.straight.selected`) ? (
              <>
                <Input
                  className="m-2"
                  placeholder="Please specify."
                  {...register(`services.${serviceIdx}.fees.straight.content`)}
                  disabled={watch(`services.${serviceIdx}.fees.none`)}
                />
                {errors.services?.[serviceIdx]?.fees?.straight?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.services[serviceIdx]?.fees?.straight?.message}
                  </p>
                )}
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
              {...register(`services.${serviceIdx}.fees.slidingScale`)}
              disabled={watch(`services.${serviceIdx}.fees.none`)}
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
              {...register(`services.${serviceIdx}.fees.medicaid_tenncare`)}
              disabled={watch(`services.${serviceIdx}.fees.none`)}
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
              {...register(`services.${serviceIdx}.fees.medicare`)}
              disabled={watch(`services.${serviceIdx}.fees.none`)}
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
              {...register(`services.${serviceIdx}.fees.private`)}
              disabled={watch(`services.${serviceIdx}.fees.none`)}
            />
            <label
              htmlFor="private"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Private Insurance
            </label>
          </div>
        </div>
        {errors.services?.[serviceIdx]?.fees?.message && (
          <p className="mt-2 text-sm text-red-400">
            {errors.services[serviceIdx]?.fees?.message}
          </p>
        )}

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
                {errors.services?.[serviceIdx]?.requiredDocuments?.other
                  ?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {
                      errors.services[serviceIdx]?.requiredDocuments?.other
                        ?.message
                    }
                  </p>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        {errors.services?.[serviceIdx]?.requiredDocuments?.message && (
          <p className="mt-2 text-sm text-red-400">
            {errors.services[serviceIdx]?.requiredDocuments?.message}
          </p>
        )}
      </div>
    );
  };

  return (
    <section className="absolute inset-0 flex flex-col justify-between pl-4 pr-4 pt-24 sm:pl-12 sm:pr-12 md:pl-24 md:pr-24">
      {/* Stepper */}
      <FormStepper
        currentPageIndex={currentStep}
        formSteps={steps}
        setCurrentStep={setCurrentStep}
      />

      {/* Form */}
      <form className="py-6" onSubmit={handleSubmit(processForm)}>
        {/* Preliminaries */}
        {currentStep === 0 && (
          <>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Preliminaries
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Let&apos;s get to know your agency...
            </p>
            <div className="mt-10 flex w-full flex-col gap-4 lg:flex-row">
              {/* right section */}
              <section className="flex w-full flex-col gap-4 lg:w-1/2">
                {/* Legal Agency Name */}
                <div>
                  <label
                    htmlFor="legalName"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Legal Agency Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="legalName"
                      {...register('legalName')}
                      autoComplete="legalName"
                      className="block h-10 w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:w-full  sm:text-sm sm:leading-6 md:w-2/3 lg:w-full"
                    />
                    {errors.legalName?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.legalName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Director Name/Title */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Director Name/Title
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="directorName"
                      {...register('directorName')}
                      autoComplete="directorName"
                      className="block h-10 w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm  sm:leading-6 md:w-2/3"
                    />
                    {errors.directorName?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.directorName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Brief Agency Information */}
                <div>
                  <label
                    htmlFor="legalStatus"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Brief Agency Information
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="agencyInfo"
                      v-model="agencyInfo"
                      {...register('agencyInfo')}
                      autoComplete="agencyInfo"
                      className="block w-full resize-none rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600  sm:text-sm sm:leading-6 md:w-5/6"
                    />
                    {errors.agencyInfo?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.agencyInfo.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* left section */}
              <section className="flex w-full flex-col gap-4 lg:w-1/2">
                <section className="flex flex-col gap-4 xl:flex-row">
                  {/* Also known as */}
                  <div className="w-full xl:w-2/3">
                    <label
                      htmlFor="lastName"
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
                        className="block h-10 w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6  md:w-2/3 xl:w-full"
                      />
                      {errors.akas?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.akas.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Legal organizational Status */}
                  <div className="w-full xl:w-1/3">
                    <label
                      htmlFor="legalStatus"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Legal Organizational Status
                    </label>
                    <div className="mt-2">
                      <select
                        id="legalStatus"
                        v-model="legalStatus"
                        {...register('legalStatus')}
                        autoComplete="legalStatus"
                        className="block h-10 w-full rounded-md border-0 bg-inherit p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 md:w-2/3 xl:w-full"
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
                      {errors.legalStatus?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.legalStatus.message}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Hours of Operation */}
                <div>
                  <label
                    htmlFor="legalStatus"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Hours of Operation
                  </label>
                  <HoursOfOperationPicker />
                </div>
              </section>
            </div>
          </>
        )}

        {/* Services */}
        {currentStep === 1 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <>
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
                      <ScrollArea className="h-96">{ServicesForm()}</ScrollArea>
                    )}
                  </ResizablePanel>
                </ResizablePanelGroup>
              ) : (
                <div className="flex flex-col">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="mx-4" type="button">
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

              <HoursOfOperationPicker />
            </>
          </motion.div>
        )}

        {/* Opportunities */}
        {currentStep === 2 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="flex flex-col gap-6">
              {/* top container */}
              <div className="flex h-full w-full flex-col gap-8 lg:flex-row">
                {/* left section */}
                <section className="h-2/3 w-full lg:w-1/2">
                  <div className="mb-2 flex flex-col">
                    <div className="flex flex-col gap-4 lg:flex-row lg:gap-12">
                      <h2 className="text-base font-semibold leading-7 text-gray-900">
                        Does your organization accept volunteers?
                      </h2>
                      {/* radio button */}
                      <div className="flex flex-row gap-4 whitespace-nowrap">
                        <div>
                          <input
                            id="volunteers"
                            type="radio"
                            value="false"
                            {...register('volunteers')}
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
                            {...register('volunteers')}
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
                    {errors.volunteers?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.volunteers.message}
                      </p>
                    )}
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
                        {...register('vol_reqs')}
                        autoComplete="vol_reqs"
                        cols={30}
                        rows={10}
                        disabled={volunteerChecked === 'false'}
                        placeholder="List type of volunteer work, age, traning, background checks, other requirements for your volunteers"
                        className="mt-2 block h-36 w-full resize-none rounded-lg border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                      ></textarea>
                      {errors.vol_reqs?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.vol_reqs.message}
                        </p>
                      )}
                    </div>

                    <div className="flex w-full flex-col gap-6 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                          Volunteer Coordinator:
                        </h2>

                        <input
                          type="text"
                          id="vol_coor"
                          {...register('vol_coor')}
                          autoComplete="vol_coor"
                          disabled={volunteerChecked === 'false'}
                          className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                        />
                        {errors.vol_coor?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.vol_coor.message}
                          </p>
                        )}
                      </div>

                      <div className="w-full sm:w-1/2">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                          Phone #:
                        </h2>

                        <input
                          type="tel"
                          id="vol_coor_tel"
                          {...register('vol_coor_tel')}
                          autoComplete="vol_coor_tel"
                          disabled={volunteerChecked === 'false'}
                          className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                        />

                        {errors.vol_coor_tel?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.vol_coor_tel.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </section>
                </section>

                {/* right section */}
                <section className="h-2/3 w-full lg:w-1/2">
                  <div className="mb-2 flex flex-col">
                    <div className="flex flex-col gap-4 lg:flex-row lg:gap-12">
                      <h2 className="text-base font-semibold leading-7 text-gray-900">
                        Does your organization accept ongoing, non-monetary
                        donations in support of programs or services?
                      </h2>
                      {/* radio button */}
                      <div className="flex flex-row gap-4 whitespace-nowrap">
                        <div>
                          <input
                            id="donation"
                            type="radio"
                            value="false"
                            {...register('donation')}
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
                            {...register('donation')}
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
                    {errors.donation?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.donation.message}
                      </p>
                    )}
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
                          {...register('don_ex')}
                          id="don_ex"
                          placeholder="Example: pet food, clothing, appliances, furniture"
                          disabled={donationChecked === 'false'}
                          className="mt-2 block h-8 w-full resize-none rounded-lg border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600  sm:text-sm sm:leading-6 lg:w-2/3"
                        ></input>
                      </div>
                      {errors.don_ex?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.don_ex.message}
                        </p>
                      )}
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
                              {...register('pickup')}
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
                              {...register('pickup')}
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
                    {errors.pickup?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.pickup.message}
                      </p>
                    )}

                    {/* pick up service */}
                    <section
                      className={`${
                        pickupChecked === 'false' ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="mb-6">
                        <div className="flex flex-row items-center gap-4">
                          <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Where?
                          </h2>
                          <input
                            type="text"
                            {...register('pickup_loc')}
                            id="pickup_loc"
                            disabled={pickupChecked === 'false'}
                            className="mt-2 block h-8 w-full resize-none rounded-lg border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                          ></input>
                        </div>
                        {errors.pickup_loc?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.pickup_loc.message}
                          </p>
                        )}
                      </div>
                    </section>

                    <div className="flex w-full flex-col gap-6 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                          Donation Coordinator:
                        </h2>

                        <input
                          type="text"
                          {...register('don_coor')}
                          id="don_coor"
                          disabled={donationChecked === 'false'}
                          className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                        />
                        {errors.don_coor?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.don_coor.message}
                          </p>
                        )}
                      </div>

                      <div className="w-full sm:w-1/2">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                          Phone #:
                        </h2>

                        <input
                          type="tel"
                          {...register('don_coor_tel')}
                          id="don_coor_tel"
                          disabled={donationChecked === 'false'}
                          className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                        />
                        {errors.don_coor_tel?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.don_coor_tel.message}
                          </p>
                        )}
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
                        helpful that you would recommend to be included in our
                        resource database?
                      </h2>
                      {/* radio button */}
                      <div className="flex flex-row gap-4 whitespace-nowrap">
                        <div>
                          <input
                            id="recommendation"
                            type="radio"
                            value="false"
                            {...register('recommendation')}
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
                            {...register('recommendation')}
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
                    {errors.recommendation?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.recommendation.message}
                      </p>
                    )}
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
                        {...register('recommendations_contact')}
                        id="recommendations_contact"
                        cols={30}
                        rows={10}
                        disabled={recommendationChecked === 'false'}
                        placeholder="List type of volunteer work, age, traning, background checks, other requirements for your volunteers"
                        className="mt-2 block h-28 w-full resize-none rounded-lg border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                      ></textarea>
                      {errors.recommendations_contact?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.recommendations_contact.message}
                        </p>
                      )}
                    </div>
                  </section>
                </section>
              </div>
            </div>
          </motion.div>
        )}

        {/* Review */}
        {currentStep === 3 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Review
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please review your selections and submit.
            </p>
          </motion.div>
        )}
      </form>

      {/* Navigation */}
      <div className="mt-8 pt-5">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={currentStep === 0}
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
            disabled={currentStep === steps.length - 1}
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
