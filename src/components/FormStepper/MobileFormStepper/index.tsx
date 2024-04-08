import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CornerDownRight } from 'lucide-react';

interface FormStepperSubpage {
  id: string;
  name: string;
  fields: Array<string>;
}

interface StepItem {
  step: { id: string; name: string; subpages: Array<FormStepperSubpage> };
  index: number;
  currentPageIndex: number;
  currentSubpageIndex: number;
  setCurrentStep: (step: number) => void;
  setCurrentSubstep: (step: number) => void;
}

interface MobileFormStepperProps {
  currentPageIndex: number;
  currentSubpageIndex: number;
  formSteps: Array<{
    id: string;
    name: string;
    subpages: Array<FormStepperSubpage>;
  }>;
  setCurrentStep: (step: number) => void;
  setCurrentSubstep: (step: number) => void;
}

const StepItem = ({
  index,
  step,
  currentPageIndex,
  currentSubpageIndex,
  setCurrentStep,
  setCurrentSubstep,
}: StepItem) => {
  if (step.subpages.length > 1) {
    console.log(step.subpages.length);
    return (
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl hover:bg-gray-400">
            {step.name}
          </AccordionTrigger>
          <AccordionContent className="flex flex-col">
            {step.subpages.map((subpage, subindex) => (
              <Button
                onClick={() => {
                  setCurrentStep(index);
                  setCurrentSubstep(subindex);
                }}
                key={`${index}.${subindex}`}
                className={`justify-start bg-white text-left text-lg hover:bg-gray-400 ${
                  subindex > currentSubpageIndex
                    ? 'pointer-events-none text-gray-400'
                    : 'text-black'
                }`}
              >
                <CornerDownRight className="mr-1" />
                {subpage.name}
              </Button>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  } else {
    return (
      <Button
        onClick={() => setCurrentStep(index)}
        className={`bg-white text-xl hover:bg-gray-400 ${
          index > currentPageIndex
            ? 'pointer-events-none text-gray-400'
            : 'text-black'
        }`}
      >
        {step.name}
      </Button>
    );
  }
};

export default function MobileFormStepper({
  currentPageIndex,
  currentSubpageIndex,
  formSteps,
  setCurrentStep,
  setCurrentSubstep,
}: MobileFormStepperProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-max p-4">
          Navigate Form
        </Button>
      </SheetTrigger>
      <SheetContent className="z-50">
        <SheetHeader className="pb-2 text-3xl">
          <SheetTitle className="text-center text-2xl">
            Navigate Form
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-center gap-2">
          {formSteps.map((step, index) => {
            return (
              <StepItem
                key={index}
                index={index}
                step={step}
                currentPageIndex={currentPageIndex}
                currentSubpageIndex={currentSubpageIndex}
                setCurrentStep={setCurrentStep}
                setCurrentSubstep={setCurrentSubstep}
              />
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
