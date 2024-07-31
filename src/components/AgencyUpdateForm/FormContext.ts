import { SubpageStepId } from '@/utils/constants/formSteps';
import { AgencyUpdateFormData } from '@/utils/types/agency-update-form';
import { createContext } from 'react';
import { DeepPartial } from 'react-hook-form';

export type FormContextType = {
  stepDelta: number;
  substepDelta: number;
  currentStep: number;
  currentSubstep: number;
  registerNextMiddleware: (
    name: SubpageStepId,
    handler: () => Promise<boolean>
  ) => void;
  updateFormData: (data: DeepPartial<AgencyUpdateFormData>) => void;
};

export const FormContext = createContext<FormContextType>(
  {} as FormContextType
);
