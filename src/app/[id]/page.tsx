'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { FormDataSchema } from '@/utils/constants/formDataSchema';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';

type Inputs = z.infer<typeof FormDataSchema>;

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
    fields: [],
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
    reset,
    trigger,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
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

  interface Service {
    id: number;
    name: string;
    description: string;
    contact: string | '';
    // hours
    eligibility: string;
    applicationProcess: {
      walkIn: boolean;
      telephone: boolean;
      appointment: boolean;
      online: boolean;
      other: {
        selected: boolean;
        content: string | '';
      };
      referral: {
        required: boolean;
        contact: string | '';
      };
    };
    fees: {
      none: boolean;
      straight: {
        selected: boolean;
        content: string | '';
      };
      slidingScale: boolean;
      insurance: {
        medicaid_tenncare: boolean;
        medicare: boolean;
        private: boolean;
      };
    };
    requiredDocuments: {
      none: boolean;
      stateId: boolean;
      ssn: boolean;
      proofOfResidence: boolean;
      proofOfIncome: boolean;
      birthCertificate: boolean;
      medicalRecords: boolean;
      psychRecords: boolean;
      proofOfNeed: boolean;
      utilityBill: boolean;
      utilityCutoffNotice: boolean;
      proofOfCitizenship: boolean;
      proofOfPublicAssistance: boolean;
      driversLicense: boolean;
      other: {
        selected: boolean;
        content: string | '';
      };
    };
  }

  const [services, setServices] = useState<Service[]>([
    {
      id: 0,
      name: 'Example Service',
      contact: 'Ada Lovelace',
      description: 'This is a description of the service.',
      eligibility: 'Must be a UTK student.',
      applicationProcess: {
        walkIn: false,
        telephone: true,
        appointment: false,
        online: true,
        other: {
          selected: false,
          content: '',
        },
        referral: {
          required: false,
          contact: '',
        },
      },
      fees: {
        none: true,
        straight: {
          selected: false,
          content: '',
        },
        slidingScale: false,
        insurance: {
          medicaid_tenncare: false,
          medicare: false,
          private: false,
        },
      },
      requiredDocuments: {
        none: false,
        stateId: true,
        ssn: false,
        proofOfResidence: false,
        proofOfIncome: false,
        birthCertificate: false,
        medicalRecords: true,
        psychRecords: false,
        proofOfNeed: true,
        utilityBill: false,
        utilityCutoffNotice: false,
        proofOfCitizenship: false,
        proofOfPublicAssistance: false,
        driversLicense: true,
        other: {
          selected: false,
          content: '',
        },
      },
    },
  ]);

  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const add_service = () => {
    const new_service: Service = {
      id: services.length,
      name: `New Service #${services.length + 1}`,
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
          contact: '',
        },
      },
      fees: {
        none: false,
        straight: {
          selected: false,
          content: '',
        },
        slidingScale: false,
        insurance: {
          medicaid_tenncare: false,
          medicare: false,
          private: false,
        },
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

    const new_services = [...services, new_service];
    setServices(new_services);
    setSelectedService(new_service);

    console.log(services.length);
  };

  const handleServiceInputChange = (value: string | boolean, field: string) => {
    const updateNestedState = (
      obj: Service,
      path: string,
      value: string | boolean
    ) => {
      const keys = path.split('.');
      const lastKey = keys.pop();
      const lastObj = keys.reduce(
        (obj, key) => (obj[key] = obj[key] || {}),
        obj
      );
      lastObj[lastKey!] = value;
    };

    if (selectedService) {
      const updatedService = { ...selectedService };
      updateNestedState(updatedService, field, value);
      const updatedServices = services.map((service) =>
        service.id === selectedService.id ? updatedService : service
      );

      setServices(updatedServices);
      setSelectedService(updatedService);
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
              {/* Whoever chose "resizable" over "resizeable" .. ;-; */}
              <ResizablePanelGroup
                direction="horizontal"
                className="rounded-lg border"
              >
                <ResizablePanel defaultSize={20}>
                  <div className="mt-2 flex flex-col px-4 py-2">
                    {services.map((service: Service) => (
                      <Button
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className="m-1"
                      >
                        {service.name}
                      </Button>
                    ))}
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
                <ResizablePanel>
                  {selectedService === null ? (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-sm text-gray-600">
                        Add a service to begin.
                      </p>
                    </div>
                  ) : (
                    /* Fix the height to be dynamic */
                    <ScrollArea className="h-96">
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
                          value={selectedService?.name}
                          onChange={(e) =>
                            handleServiceInputChange(e.target.value, 'name')
                          }
                        />

                        <label
                          htmlFor="description"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Full Description
                        </label>
                        <Textarea
                          id="description"
                          className="mb-2"
                          value={selectedService?.description}
                          onChange={(e) =>
                            handleServiceInputChange(
                              e.target.value,
                              'description'
                            )
                          }
                        />

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
                          value={selectedService?.contact}
                          onChange={(e) =>
                            handleServiceInputChange(e.target.value, 'contact')
                          }
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
                          value={selectedService?.eligibility}
                          onChange={(e) =>
                            handleServiceInputChange(
                              e.target.value,
                              'eligibility'
                            )
                          }
                        />

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
                            <Checkbox
                              id="walkIn"
                              checked={
                                selectedService?.applicationProcess.walkIn
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'applicationProcess.walkIn'
                                )
                              }
                            />
                            <label
                              htmlFor="walkIn"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Walk-in
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="telephone"
                              checked={
                                selectedService?.applicationProcess.telephone
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'applicationProcess.telephone'
                                )
                              }
                            />
                            <label
                              htmlFor="telephone"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Telephone
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="appointment"
                              checked={
                                selectedService?.applicationProcess.appointment
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'applicationProcess.appointment'
                                )
                              }
                            />
                            <label
                              htmlFor="appointment"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Call to Schedule an Appointment
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="online"
                              checked={
                                selectedService?.applicationProcess.online
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'applicationProcess.online'
                                )
                              }
                            />
                            <label
                              htmlFor="online"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Apply Online
                            </label>
                          </div>

                          {/* Fix this checkbox, make input only appear if checked! */}
                          <div className="space-x-2">
                            <Checkbox
                              id="other"
                              checked={
                                selectedService?.applicationProcess.other
                                  .selected
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'applicationProcess.other.selected'
                                )
                              }
                            />
                            <label
                              htmlFor="other"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Other
                            </label>
                            {selectedService?.applicationProcess.other
                              .selected ? (
                              <Input
                                className="m-2"
                                value={
                                  selectedService?.applicationProcess.other
                                    .content
                                }
                                onChange={(e) =>
                                  handleServiceInputChange(
                                    e.target.value,
                                    'applicationProcess.other.content'
                                  )
                                }
                              />
                            ) : (
                              <></>
                            )}
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="referral"
                              checked={
                                selectedService?.applicationProcess.referral
                                  .required
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'applicationProcess.referral.required'
                                )
                              }
                            />
                            <label
                              htmlFor="referral"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Referral Required
                            </label>
                            {selectedService?.applicationProcess.referral
                              .required ? (
                              <Input
                                className="m-2"
                                placeholder="By whom?"
                                value={
                                  selectedService?.applicationProcess.referral
                                    .contact
                                }
                                onChange={(e) =>
                                  handleServiceInputChange(
                                    e.target.value,
                                    'applicationProcess.referral.contact'
                                  )
                                }
                              />
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>

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
                            <Checkbox
                              id="noFees"
                              checked={selectedService?.fees.none}
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(checked, 'fees.none')
                              }
                            />
                            <label
                              htmlFor="noFees"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              No Fees
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="straight"
                              checked={selectedService?.fees.straight.selected}
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'fees.straight.selected'
                                )
                              }
                              disabled={selectedService?.fees.none}
                            />
                            <label
                              htmlFor="straight"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Straight Fee
                            </label>
                            {selectedService?.fees.straight.selected ? (
                              <Input
                                className="m-2"
                                placeholder="Please specify."
                                value={selectedService?.fees.straight.content}
                                onChange={(e) =>
                                  handleServiceInputChange(
                                    e.target.value,
                                    'fees.straight.content'
                                  )
                                }
                                disabled={selectedService?.fees.none}
                              />
                            ) : (
                              <></>
                            )}
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="sliding"
                              checked={selectedService?.fees.slidingScale}
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'fees.slidingScale'
                                )
                              }
                              disabled={selectedService?.fees.none}
                            />
                            <label
                              htmlFor="sliding"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Sliding Scale Fee
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="medicaid_tenncare"
                              checked={
                                selectedService?.fees.insurance
                                  .medicaid_tenncare
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'fees.insurance.medicaid_tenncare'
                                )
                              }
                              disabled={selectedService?.fees.none}
                            />
                            <label
                              htmlFor="medicaid_tenncare"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Medicaid/TennCare
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="medicare"
                              checked={selectedService?.fees.insurance.medicare}
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'fees.insurance.medicare'
                                )
                              }
                              disabled={selectedService?.fees.none}
                            />
                            <label
                              htmlFor="medicare"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Medicare
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="private"
                              checked={selectedService?.fees.insurance.private}
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'fees.insurance.private'
                                )
                              }
                              disabled={selectedService?.fees.none}
                            />
                            <label
                              htmlFor="private"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Private Insurance
                            </label>
                          </div>
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
                        <div
                          id="requiredDocuments"
                          className="mb-2 ml-2 grid grid-cols-3"
                        >
                          <div className="space-x-2">
                            <Checkbox
                              id="noDocuments"
                              checked={selectedService?.requiredDocuments.none}
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'requiredDocuments.none'
                                )
                              }
                            />
                            <label
                              htmlFor="noDocuments"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              No Documents
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="stateId"
                              checked={
                                selectedService?.requiredDocuments.stateId
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'requiredDocuments.stateId'
                                )
                              }
                              disabled={selectedService?.requiredDocuments.none}
                            />
                            <label
                              htmlFor="stateId"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              State Issued ID
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="ssn"
                              checked={selectedService?.requiredDocuments.ssn}
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'requiredDocuments.ssn'
                                )
                              }
                              disabled={selectedService?.requiredDocuments.none}
                            />
                            <label
                              htmlFor="ssn"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Social Security Card
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="proofOfResidence"
                              checked={
                                selectedService?.requiredDocuments
                                  .proofOfResidence
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'requiredDocuments.proofOfResidence'
                                )
                              }
                              disabled={selectedService?.requiredDocuments.none}
                            />
                            <label
                              htmlFor="proofOfResidence"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Proof of Residence
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="proofOfIncome"
                              checked={
                                selectedService?.requiredDocuments.proofOfIncome
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'requiredDocuments.proofOfIncome'
                                )
                              }
                              disabled={selectedService?.requiredDocuments.none}
                            />
                            <label
                              htmlFor="proofOfIncome"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Proof of Income
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="birthCertificate"
                              checked={
                                selectedService?.requiredDocuments
                                  .birthCertificate
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'requiredDocuments.birthCertificate'
                                )
                              }
                              disabled={selectedService?.requiredDocuments.none}
                            />
                            <label
                              htmlFor="birthCertificate"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Birth Certificate
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="medicalRecords"
                              checked={
                                selectedService?.requiredDocuments
                                  .medicalRecords
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'requiredDocuments.medicalRecords'
                                )
                              }
                              disabled={selectedService?.requiredDocuments.none}
                            />
                            <label
                              htmlFor="medicalRecords"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Medical Records
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="psychRecords"
                              checked={
                                selectedService?.requiredDocuments.psychRecords
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'requiredDocuments.psychRecords'
                                )
                              }
                              disabled={selectedService?.requiredDocuments.none}
                            />
                            <label
                              htmlFor="psychRecords"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Psych Records
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="proofOfNeed"
                              checked={
                                selectedService?.requiredDocuments.proofOfNeed
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'requiredDocuments.proofOfNeed'
                                )
                              }
                              disabled={selectedService?.requiredDocuments.none}
                            />
                            <label
                              htmlFor="proofOfNeed"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Proof of Need
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="utilityBill"
                              checked={
                                selectedService?.requiredDocuments.utilityBill
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'requiredDocuments.utilityBill'
                                )
                              }
                              disabled={selectedService?.requiredDocuments.none}
                            />
                            <label
                              htmlFor="utilityBill"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Utility Bill
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="utilityCutoffNotice"
                              checked={
                                selectedService?.requiredDocuments
                                  .utilityCutoffNotice
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'requiredDocuments.utilityCutoffNotice'
                                )
                              }
                              disabled={selectedService?.requiredDocuments.none}
                            />
                            <label
                              htmlFor="utilityCutoffNotice"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Utility Cutoff Notice
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="proofOfCitizenship"
                              checked={
                                selectedService?.requiredDocuments
                                  .proofOfCitizenship
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'requiredDocuments.proofOfCitizenship'
                                )
                              }
                              disabled={selectedService?.requiredDocuments.none}
                            />
                            <label
                              htmlFor="proofOfCitizenship"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Proof of Citizenship
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="proofOfPublicAssistance"
                              checked={
                                selectedService?.requiredDocuments
                                  .proofOfPublicAssistance
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'requiredDocuments.proofOfPublicAssistance'
                                )
                              }
                              disabled={selectedService?.requiredDocuments.none}
                            />
                            <label
                              htmlFor="proofOfPublicAssistance"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Proof of Public Assistance
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="driversLicense"
                              checked={
                                selectedService?.requiredDocuments
                                  .driversLicense
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'requiredDocuments.driversLicense'
                                )
                              }
                              disabled={selectedService?.requiredDocuments.none}
                            />
                            <label
                              htmlFor="driversLicense"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Driver&apos;s License
                            </label>
                          </div>

                          <div className="space-x-2">
                            <Checkbox
                              id="other"
                              checked={
                                selectedService?.requiredDocuments.other
                                  .selected
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleServiceInputChange(
                                  checked,
                                  'requiredDocuments.other.selected'
                                )
                              }
                              disabled={selectedService?.requiredDocuments.none}
                            />
                            <label
                              htmlFor="other"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Other
                            </label>
                            {selectedService?.requiredDocuments.other
                              .selected ? (
                              <Input
                                className="m-2"
                                placeholder="Please specify."
                                value={
                                  selectedService?.requiredDocuments.other
                                    .content
                                }
                                onChange={(e) =>
                                  handleServiceInputChange(
                                    e.target.value,
                                    'requiredDocuments.other.content'
                                  )
                                }
                                disabled={
                                  selectedService?.requiredDocuments.none
                                }
                              />
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
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
