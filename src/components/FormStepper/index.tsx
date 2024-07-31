import { useWindowSize } from '@/utils/hooks/useWindowSize';
import DesktopFormStepper from './DesktopFormStepper';
import MobileFormStepper from './MobileFormStepper';
import { useTranslations } from 'next-intl';

interface FormStepperSubpage {
  id: string;
  name: string;
  fields: Readonly<Array<string>>;
}

interface FormStep {
  id: string;
  name: string;
  subpages: Readonly<FormStepperSubpage[]>;
}

interface FormStepperProps<TFormSteps extends Readonly<FormStep[]>> {
  currentPageIndex: number;
  currentSubpageIndex: number;
  formSteps: TFormSteps;
  setCurrentStep: (step: number) => void;
  setCurrentSubstep: (step: number) => void;
}

export default function FormStepper<TFormSteps extends Readonly<FormStep[]>>({
  currentPageIndex,
  currentSubpageIndex,
  formSteps,
  setCurrentStep,
  setCurrentSubstep,
}: FormStepperProps<TFormSteps>) {
  const { width: screenWidth } = useWindowSize();
  const t = useTranslations('Form');
  const t2 = useTranslations('Components.formStepper');

  const translateFormSteps = () => {
    return formSteps.map((step) => ({
      ...step,
      name: t(step.name.toLowerCase() + '.title'),
      subpages: step.subpages.map((subpage) => ({
        ...subpage,
        name:
          step.subpages.length > 1
            ? t(
                `${step.name.toLowerCase()}.${subpage.name.toLowerCase()}.title`
              )
            : step.name.toLowerCase() + '.title',
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
