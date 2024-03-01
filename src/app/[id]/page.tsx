'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import {
  FormDataSchema,
  ServiceSchema,
} from '@/utils/constants/formDataSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';

import DesktopFormStepper from '@/components/FormStepper/DesktopFormStepper';
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
import { Plus, Trash } from 'lucide-react';

type Inputs = z.infer<typeof FormDataSchema>;
type Service = z.infer<typeof ServiceSchema>;

const steps = [
  {
    id: 'Step 1',
    name: 'Preliminaries',
    fields: [
      'legalName',
      'akas',
      'legalStatus',
      'agencyInfo',
      'directorName',
      'open',
      'close',
      'days',
    ],
  },
  {
    id: 'Step 2',
    name: 'Services',
    fields: [
      'name',
      'description',
      'contact',
      'eligibility',
      'applicationProcess',
      'fees',
      'requiredDocuments',
    ],
  },
  { id: 'Step 3', name: 'Opportunities', fields: [] },
  { id: 'Step 4', name: 'Review', fields: [] },
];

export default function Form({ params }: { params: { id: string } }) {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const delta = currentStep - previousStep;

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    trigger,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      services: [],
    },
  });

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

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
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

  const [isMondayChecked, setMondayChecked] = useState(false);
  const [isTuesdayChecked, setTuesdayChecked] = useState(false);
  const [isWednesdayChecked, setWednesdayChecked] = useState(false);
  const [isThursdayChecked, setThursdayChecked] = useState(false);
  const [isFridayChecked, setFridayChecked] = useState(false);

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
      (service) => service.id === id
    );
    getValues('services').splice(deleteIdx, 1);

    if (serviceIdx === deleteIdx) {
      setServiceIdx(-1);
    } else if (serviceIdx > deleteIdx) {
      setServiceIdx(serviceIdx - 1);
    }
  };

  // Prevents field validation for the services form as it switches to another service
  // that has the error if you are working on a different service.
  // Might remove.
  const handleServicesKeyDown = (e: React.KeyboardEvent) => {
    // Allow textarea as it is multiline.
    if (e.target instanceof HTMLElement && e.target.tagName === 'TEXTAREA')
      return;
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <section className="absolute inset-0 flex flex-col justify-between pb-4 pl-24 pr-24 pt-24">
      {/* Stepper */}
      <DesktopFormStepper
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
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6 sm:grid-rows-3">
              <div className="sm:col-span-3">
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
                    className="block h-10 w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600  sm:text-sm sm:leading-6"
                  />
                  {errors.legalName?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.legalName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
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
                    className="block h-10 w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600  sm:text-sm sm:leading-6"
                  />
                  {errors.akas?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.akas.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-1">
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
                    className="block h-10 w-full rounded-md border-0 bg-inherit p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
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

              <div className="sm:col-span-3">
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
                    className="block h-10 w-2/3 rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600  sm:text-sm sm:leading-6"
                  />
                  {errors.directorName?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.directorName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3 sm:row-span-2">
                <label
                  htmlFor="legalStatus"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Hours of Operation
                </label>
                <div className="mt-2">
                  <fieldset className="mt-8">
                    <label
                      htmlFor="legalStatus"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Select day(s) of operation
                    </label>
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
                            ? 'w-18 ml-2 rounded-sm bg-sky-600 px-2 py-1 text-white'
                            : 'w-18 ml-2 rounded-sm bg-slate-200 px-2 py-1  text-gray-900'
                        }
                      >
                        Monday
                      </span>
                    </label>

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
                            ? 'w-18 ml-2 rounded-sm bg-sky-600 px-2 py-1 text-white'
                            : 'w-18 ml-2 rounded-sm bg-slate-200 px-2 py-1  text-gray-900'
                        }
                      >
                        Tuesday
                      </span>
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        id="wednesday"
                        className="form-checkbox hidden"
                        checked={isWednesdayChecked}
                        {...register('days.wednesday', {
                          onChange: () => {
                            setWednesdayChecked(!isWednesdayChecked);
                          },
                        })}
                      />
                      <span
                        className={
                          isWednesdayChecked
                            ? 'w-18 ml-2 rounded-sm bg-sky-600 px-2 py-1 text-white'
                            : 'w-18 ml-2 rounded-sm bg-slate-200 px-2 py-1  text-gray-900'
                        }
                      >
                        Wednesday
                      </span>
                    </label>

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
                            ? 'w-18 ml-2 rounded-sm bg-sky-600 px-2 py-1 text-white'
                            : 'w-18 ml-2 rounded-sm bg-slate-200 px-2 py-1  text-gray-900'
                        }
                      >
                        Thursday
                      </span>
                    </label>

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
                            ? 'w-18 ml-2 rounded-sm bg-sky-600 px-2 py-1 text-white'
                            : 'w-18 ml-2 rounded-sm bg-slate-200 px-2 py-1  text-gray-900'
                        }
                      >
                        Friday
                      </span>
                    </label>
                    {errors.days?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.days.message}
                      </p>
                    )}
                  </fieldset>

                  <div className="float-left mt-6 flex justify-center gap-x-4">
                    <div className="mt-1">
                      <label
                        htmlFor="open"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Open
                      </label>
                      <input
                        type="text"
                        id="open"
                        {...register('open')}
                        autoComplete="open"
                        className="block h-10 rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600  sm:text-sm sm:leading-6"
                      />
                      {errors.open?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.open.message}
                        </p>
                      )}
                    </div>
                    <div className="flex items-end justify-center">
                      <p>to</p>
                    </div>
                    <div className="mt-1">
                      <label
                        htmlFor="close"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Close
                      </label>
                      <input
                        type="text"
                        id="close"
                        {...register('close')}
                        autoComplete="close"
                        className="block h-10 rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600  sm:text-sm sm:leading-6"
                      />
                      {errors.close?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.close.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3">
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
                    className="block w-5/6 resize-none rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  {errors.agencyInfo?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.agencyInfo.message}
                    </p>
                  )}
                </div>
              </div>
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
              <ResizablePanelGroup
                direction="horizontal"
                className="rounded-lg border"
              >
                <ResizablePanel defaultSize={20}>
                  <div className="mt-2 flex flex-col px-4 py-2">
                    {/* Fix the height to be dynamic */}
                    <ScrollArea className="flex h-80 flex-col">
                      {getValues('services').map((service: Service, idx) => (
                        <div key={idx} className="flex flex-row">
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
                          >
                            <Trash />
                          </Button>
                        </div>
                      ))}
                    </ScrollArea>
                    <Separator className="my-2" />
                    <Button
                      className="m-1"
                      variant="outline"
                      onClick={add_service}
                    >
                      <Plus />
                      Add Service
                    </Button>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={70}>
                  {serviceIdx === -1 ? (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-sm text-gray-600">
                        Add or select a service to begin.
                      </p>
                    </div>
                  ) : (
                    /* Fix the height to be dynamic */
                    <ScrollArea className="h-96">
                      <div
                        className="mt-2 px-4 py-2"
                        onKeyDown={handleServicesKeyDown}
                      >
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
                        {errors.services?.[serviceIdx]?.description
                          ?.message && (
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
                          <p className="text-sm leading-6 text-gray-600">
                            TBD...
                          </p>
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
                        {errors.services?.[serviceIdx]?.eligibility
                          ?.message && (
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
                        <div
                          id="applicationProcess"
                          className="mb-2 ml-2 flex flex-col"
                        >
                          <div className="space-x-2">
                            <input
                              type="checkbox"
                              id="walkIn"
                              className="form-checkbox"
                              {...register(
                                `services.${serviceIdx}.applicationProcess.walkIn`
                              )}
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
                              {...register(
                                `services.${serviceIdx}.applicationProcess.online`
                              )}
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
                              id="other"
                              className="form-checkbox"
                              {...register(
                                `services.${serviceIdx}.applicationProcess.other.selected`
                              )}
                            />
                            <label
                              htmlFor="other"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Other
                            </label>
                            {getValues(
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
                                {errors.services?.[serviceIdx]
                                  ?.applicationProcess?.other?.message && (
                                  <p className="mt-2 text-sm text-red-400">
                                    {
                                      errors.services[serviceIdx]
                                        ?.applicationProcess?.other?.message
                                    }
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
                            {getValues(
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
                                {errors.services?.[serviceIdx]
                                  ?.applicationProcess?.referral?.message && (
                                  <p className="mt-2 text-sm text-red-400">
                                    {
                                      errors.services[serviceIdx]
                                        ?.applicationProcess?.referral?.message
                                    }
                                  </p>
                                )}
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                        {errors.services?.[serviceIdx]?.applicationProcess
                          ?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {
                              errors.services[serviceIdx]?.applicationProcess
                                ?.message
                            }
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
                          Are individuals charged for your services? What is
                          your fee structure?
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
                              {...register(
                                `services.${serviceIdx}.fees.straight.selected`
                              )}
                              disabled={getValues(
                                `services.${serviceIdx}.fees.none`
                              )}
                            />
                            <label
                              htmlFor="straight"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Straight Fee
                            </label>
                            {getValues(
                              `services.${serviceIdx}.fees.straight.selected`
                            ) ? (
                              <>
                                <Input
                                  className="m-2"
                                  placeholder="Please specify."
                                  {...register(
                                    `services.${serviceIdx}.fees.straight.content`
                                  )}
                                  disabled={getValues(
                                    `services.${serviceIdx}.fees.none`
                                  )}
                                />
                                {errors.services?.[serviceIdx]?.fees?.straight
                                  ?.message && (
                                  <p className="mt-2 text-sm text-red-400">
                                    {
                                      errors.services[serviceIdx]?.fees
                                        ?.straight?.message
                                    }
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
                              {...register(
                                `services.${serviceIdx}.fees.slidingScale`
                              )}
                              disabled={getValues(
                                `services.${serviceIdx}.fees.none`
                              )}
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
                                `services.${serviceIdx}.fees.medicaid_tenncare`
                              )}
                              disabled={getValues(
                                `services.${serviceIdx}.fees.none`
                              )}
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
                              {...register(
                                `services.${serviceIdx}.fees.medicare`
                              )}
                              disabled={getValues(
                                `services.${serviceIdx}.fees.none`
                              )}
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
                              {...register(
                                `services.${serviceIdx}.fees.private`
                              )}
                              disabled={getValues(
                                `services.${serviceIdx}.fees.none`
                              )}
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
                        <div
                          id="requiredDocuments"
                          className="mb-2 ml-2 grid grid-cols-3"
                        >
                          <div className="space-x-2">
                            <input
                              type="checkbox"
                              id="noDocuments"
                              className="form-checkbox"
                              {...register(
                                `services.${serviceIdx}.requiredDocuments.none`
                              )}
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
                              {...register(
                                `services.${serviceIdx}.requiredDocuments.stateId`
                              )}
                              disabled={getValues(
                                `services.${serviceIdx}.requiredDocuments.none`
                              )}
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
                              {...register(
                                `services.${serviceIdx}.requiredDocuments.ssn`
                              )}
                              disabled={getValues(
                                `services.${serviceIdx}.requiredDocuments.none`
                              )}
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
                              disabled={getValues(
                                `services.${serviceIdx}.requiredDocuments.none`
                              )}
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
                              disabled={getValues(
                                `services.${serviceIdx}.requiredDocuments.none`
                              )}
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
                              disabled={getValues(
                                `services.${serviceIdx}.requiredDocuments.none`
                              )}
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
                              disabled={getValues(
                                `services.${serviceIdx}.requiredDocuments.none`
                              )}
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
                              disabled={getValues(
                                `services.${serviceIdx}.requiredDocuments.none`
                              )}
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
                              disabled={getValues(
                                `services.${serviceIdx}.requiredDocuments.none`
                              )}
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
                              disabled={getValues(
                                `services.${serviceIdx}.requiredDocuments.none`
                              )}
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
                              disabled={getValues(
                                `services.${serviceIdx}.requiredDocuments.none`
                              )}
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
                              disabled={getValues(
                                `services.${serviceIdx}.requiredDocuments.none`
                              )}
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
                              disabled={getValues(
                                `services.${serviceIdx}.requiredDocuments.none`
                              )}
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
                              disabled={getValues(
                                `services.${serviceIdx}.requiredDocuments.none`
                              )}
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
                              id="other"
                              className="form-checkbox"
                              {...register(
                                `services.${serviceIdx}.requiredDocuments.other.selected`
                              )}
                              disabled={getValues(
                                `services.${serviceIdx}.requiredDocuments.none`
                              )}
                            />
                            <label
                              htmlFor="other"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Other
                            </label>
                            {getValues(
                              `services.${serviceIdx}.requiredDocuments.other.selected`
                            ) ? (
                              <>
                                <Input
                                  className="m-2"
                                  placeholder="Please specify."
                                  {...register(
                                    `services.${serviceIdx}.requiredDocuments.other.content`
                                  )}
                                  disabled={getValues(
                                    `services.${serviceIdx}.requiredDocuments.none`
                                  )}
                                />
                                {errors.services?.[serviceIdx]
                                  ?.requiredDocuments?.other?.message && (
                                  <p className="mt-2 text-sm text-red-400">
                                    {
                                      errors.services[serviceIdx]
                                        ?.requiredDocuments?.other?.message
                                    }
                                  </p>
                                )}
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                        {errors.services?.[serviceIdx]?.requiredDocuments
                          ?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {
                              errors.services[serviceIdx]?.requiredDocuments
                                ?.message
                            }
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  )}
                </ResizablePanel>
              </ResizablePanelGroup>
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
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Insert Opportunities
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Opportunities form
            </p>
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
      <Footer />
    </section>
  );
}
