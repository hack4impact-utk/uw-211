'use client';

import { useState } from 'react';
import { DeepPartial } from 'react-hook-form';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import FormStepper from '@/components/FormStepper';
import { formSteps, SubpageStepId } from '@/utils/constants/formSteps';
import Spinner from '@/components/Spinner';
import { useTranslations } from 'next-intl';
import AccessibilitySection from '@/components/AgencyUpdateForm/AccessibilitySection';
import ServicesSection from '@/components/AgencyUpdateForm/ServicesSection';
import OpportunitiesSection from '@/components/AgencyUpdateForm/OpportunitiesSection';
import ReviewSection from '@/components/AgencyUpdateForm/ReviewSection';
import { AgencyUpdateFormData } from '@/utils/types/agency-update-form';
import { FormContext } from './FormContext';
import PreliminariesSection from './PreliminariesSection';

const steps = formSteps;

type NextPageMiddleware = Partial<{
  [key in SubpageStepId]: () => Promise<void>;
}>;

interface AgencyUpdateFormProps {
  defaultValues?: DeepPartial<AgencyUpdateFormData>;
  onSubmit: (data: AgencyUpdateFormData) => void;
  loading?: boolean;
}

export default function AgencyUpdateForm({
  defaultValues,
  onSubmit,
  loading,
}: AgencyUpdateFormProps) {
  const t = useTranslations('Form');

  const [previousStep, setPreviousStep] = useState(-1);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubstep, setCurrentSubstep] = useState(0);
  const [previousSubstep, setPreviousSubstep] = useState(-1);
  const delta = currentStep - previousStep;
  const subdelta = currentSubstep - previousSubstep;

  const [nextMiddlewares, setNextMiddlewares] = useState<NextPageMiddleware>(
    {}
  );
  const registerNextMiddleware = (
    name: SubpageStepId,
    handler: () => Promise<boolean>
  ) => {
    setNextMiddlewares((prev) => ({
      ...prev,
      [name]: handler,
    }));
  };

  const [formData, setFormData] = useState<AgencyUpdateFormData>(
    defaultValues as AgencyUpdateFormData
  );
  function updateFormData(data: DeepPartial<AgencyUpdateFormData>) {
    setFormData((prev) => ({
      ...prev,
      ...(data as AgencyUpdateFormData), // TODO: figure out if we don't need to cast
    }));
  }

  const next = async () => {
    const subpageLength = steps[currentStep].subpages.length - 1;
    const currentSubpage = steps[currentStep].subpages[currentSubstep];

    if (currentStep < steps.length) {
      // try running the next middleware
      if (nextMiddlewares[currentSubpage.id]) {
        const goToNextStep = await nextMiddlewares[currentSubpage.id]?.();
        if (!goToNextStep) return;
      }
      if (currentSubstep < subpageLength) {
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

    window.scrollTo(0, 0);
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

    window.scrollTo(0, 0);
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
      <FormContext.Provider
        value={{
          stepDelta: delta,
          substepDelta: subdelta,
          registerNextMiddleware,
          updateFormData,
          currentStep,
          currentSubstep,
        }}
      >
        <form className="pt-6" onSubmit={() => onSubmit(formData)}>
          {/* Preliminaries */}
          {currentStep === 0 && (
            <PreliminariesSection defaultValues={formData} />
          )}

          {/* Accessibility */}
          {currentStep === 1 && (
            <AccessibilitySection
              defaultValues={formData}
              setFormData={setFormData}
            />
          )}

          {/* Services */}
          {currentStep === 2 && <ServicesSection defaultValues={formData} />}

          {/* Opportunities */}
          {currentStep === 3 && (
            <OpportunitiesSection defaultValues={formData} />
          )}

          {/* Review */}
          {currentStep === 4 && <ReviewSection formData={formData} />}

          {/* Navigation */}
          <div className="mt-24 pt-5">
            <div className="flex items-center justify-between">
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

              {currentStep === steps.length - 1 &&
              currentSubstep === steps[steps.length - 1].subpages.length - 1 ? (
                <Button type="submit" className="w-36" disabled={loading}>
                  {loading ? (
                    <Spinner className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>{t('review.button')}</span>
                  )}
                </Button>
              ) : (
                <button
                  type="button"
                  onClick={next}
                  disabled={
                    currentStep === steps.length - 1 &&
                    currentSubstep ===
                      steps[steps.length - 1].subpages.length - 1
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
              )}
            </div>
          </div>
        </form>
      </FormContext.Provider>
      <Footer className="pb-2 pt-6" />
    </section>
  );
}
