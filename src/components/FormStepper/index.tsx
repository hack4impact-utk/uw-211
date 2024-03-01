import { useWindowSize } from '@/utils/hooks/useWindowSize';
import DesktopFormStepper from './DesktopFormStepper';
import MobileFormStepper from './MobileFormStepper';

interface FormStepperProps {
  currentPageIndex: number;
  formSteps: Array<{ id: string; name: string; fields: Array<string> }>;
  setCurrentStep: (step: number) => void;
}

export default function FormStepper({
  currentPageIndex,
  formSteps,
  setCurrentStep,
}: FormStepperProps) {
  const { width: screenWidth } = useWindowSize();

  if (screenWidth < 768) {
    return (
      <MobileFormStepper
        currentPageIndex={currentPageIndex}
        formSteps={formSteps}
        setCurrentStep={setCurrentStep}
      />
    );
  }

  return (
    <DesktopFormStepper
      currentPageIndex={currentPageIndex}
      formSteps={formSteps}
      setCurrentStep={setCurrentStep}
    />
  );
}
