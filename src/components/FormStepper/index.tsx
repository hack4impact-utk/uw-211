import { useWindowSize } from '@/utils/hooks/useWindowSize';
import DesktopFormStepper from './DesktopFormStepper';
import MobileFormStepper from './MobileFormStepper';
import { useTranslations } from 'next-intl';

interface FormStepperSubpage {
  id: string;
  name: string;
  fields: Array<string>;
}

interface FormStep {
  id: string;
  name: string;
  subpages: FormStepperSubpage[];
}

interface FormStepperProps {
  currentPageIndex: number;
  currentSubpageIndex: number;
  formSteps: FormStep[];
  setCurrentStep: (step: number) => void;
  setCurrentSubstep: (step: number) => void;
}

export default function FormStepper({
  currentPageIndex,
  currentSubpageIndex,
  formSteps,
  setCurrentStep,
  setCurrentSubstep,
}: FormStepperProps) {
  const { width: screenWidth } = useWindowSize();
  const t = useTranslations('Form');
  const t2 = useTranslations('Components.formStepper');

  const translateFormSteps = () => {
    return formSteps.map((step) => ({
      ...step,
      name: t(step.name.toLowerCase() + '.title'),
      subpages: step.subpages.map((subpage) => ({
        ...subpage,
        name: t(
          `${step.name.toLowerCase()}.${subpage.name.toLowerCase()}.title`
        ),
      })),
    }));
  };

  if (screenWidth < 768) {
    return (
      <MobileFormStepper
        currentPageIndex={currentPageIndex}
        currentSubpageIndex={currentSubpageIndex}
        formSteps={translateFormSteps()}
        setCurrentStep={setCurrentStep}
        setCurrentSubstep={setCurrentSubstep}
        title={t2('mobileTitle')}
      />
    );
  }

  return (
    <DesktopFormStepper
      currentPageIndex={currentPageIndex}
      currentSubpageIndex={currentSubpageIndex}
      formSteps={translateFormSteps()}
      setCurrentStep={setCurrentStep}
      setCurrentSubstep={setCurrentSubstep}
    />
  );
}
