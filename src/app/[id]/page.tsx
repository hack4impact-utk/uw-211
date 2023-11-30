'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { FormDataSchema } from '@/utils/constants/formDataSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';

import DesktopFormStepper from '@/components/FormStepper/DesktopFormStepper';

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
  { id: 'Step 4', name: 'Submit', fields: [] },
];

export default function Form({ params }: { params: { id: string } }) {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
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

  return (
    <section className="absolute inset-0 flex flex-col justify-between p-24">
      {/* Stepper */}
      <DesktopFormStepper
        currentPageIndex={currentStep}
        formSteps={steps}
        setCurrentStep={setCurrentStep}
      />

      {/* Form */}
      <form className="mt-4 py-6" onSubmit={handleSubmit(processForm)}>
        {/* Preliminaries */}
        {currentStep === 0 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
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
          </motion.div>
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
                Insert Services
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Services form
              </p>
            </>
          </motion.div>
        )}

        {/* Opportunities */}
        {currentStep === 2 && (
          <>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Insert Opportunities
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Opportunities form
            </p>
          </>
        )}

        {/* Submit */}
        {currentStep === 3 && (
          <>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Complete
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Thank you for your submission.
            </p>
          </>
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
    </section>
  );
}
