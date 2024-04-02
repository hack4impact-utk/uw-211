import { useWindowSize } from '@/utils/hooks/useWindowSize';
import DesktopFormStepper from './DesktopFormStepper';
// import MobileFormStepper from './MobileFormStepper';

interface FormStepperSubpage {
  id: string;
  name: string;
  fields: Array<string>;
}
interface FormStepperProps {
  currentPageIndex: number;
  formSteps: Array<{
    id: string;
    name: string;
    subpages: Array<FormStepperSubpage>;
  }>;
  setCurrentStep: (step: number) => void;
  setCurrentSubstep: (step: number) => void;
}

export default function FormStepper({
  currentPageIndex,
  formSteps,
  setCurrentStep,
  setCurrentSubstep,
}: FormStepperProps) {
  const { width: screenWidth } = useWindowSize();

  if (screenWidth < 768) {
    // return (
    // <MobileFormStepper
    //   currentPageIndex={currentPageIndex}
    //   formSteps={formSteps}
    //   setCurrentStep={setCurrentStep}
    //   setCurrentSubstep={setCurrentSubstep}
    // />
    // );
  }

  return (
    <DesktopFormStepper
      currentPageIndex={currentPageIndex}
      formSteps={formSteps}
      setCurrentStep={setCurrentStep}
      setCurrentSubstep={setCurrentSubstep}
    />
  );
}
