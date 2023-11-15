import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';

interface DesktopFormStepperProps {
  currentPageIndex: number;
  formSteps: Array<{ id: string; name: string; fields: Array<string> }>;
  setCurrentStep: (step: number) => void;
}

export default function DesktopFormStepper({
  currentPageIndex,
  formSteps,
  setCurrentStep,
}: DesktopFormStepperProps) {
  return (
    <Breadcrumb>
      {formSteps.map((step, index) => (
        <BreadcrumbItem key={index}>
          <Button
            onClick={() => setCurrentStep(index)}
            className={`bg-white hover:bg-gray-400 ${
              index > currentPageIndex
                ? 'pointer-events-none text-gray-400'
                : 'text-black'
            }`}
          >
            {step.name}
          </Button>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}
