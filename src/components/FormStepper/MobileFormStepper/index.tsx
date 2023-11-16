import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface MobileFormStepperProps {
  currentPageIndex: number;
  formSteps: Array<{ id: string; name: string; fields: Array<string> }>;
  setCurrentStep: (step: number) => void;
}

export default function MobileFormStepper({
  currentPageIndex,
  formSteps,
  setCurrentStep,
}: MobileFormStepperProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Navigate Form</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="pb-2">
          <SheetTitle>Navigate Form</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-center gap-2">
          {formSteps.map((step, index) => {
            return (
              <Button
                onClick={() => setCurrentStep(index)}
                key={index}
                className={`bg-white hover:bg-gray-400 ${
                  index > currentPageIndex
                    ? 'pointer-events-none text-gray-400'
                    : 'text-black'
                }`}
              >
                {step.name}
              </Button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
