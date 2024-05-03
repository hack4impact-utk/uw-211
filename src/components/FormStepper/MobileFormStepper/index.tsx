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
  title: string;
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
    // there are subpages
    return (
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger
            className={`rounded text-xl hover:bg-slate-200 ${
              index > currentPageIndex
                ? 'pointer-events-none text-gray-400'
                : 'text-black'
            }`}
          >
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
                className={`justify-start bg-white text-left text-lg hover:bg-slate-200 ${
                  // have not got to this subpage && have to go to page at all
                  subindex > currentSubpageIndex && index >= currentPageIndex
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
    // no subpages, return normal button
    return (
      <Button
        onClick={() => {
          setCurrentStep(index);
          setCurrentSubstep(0);
        }}
        className={`hover:bg-bg-slate-200 bg-white text-xl ${
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
  title,
}: MobileFormStepperProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-max p-4">
          {title}
        </Button>
      </SheetTrigger>
      <SheetContent className="z-50">
        <SheetHeader className="pb-2 text-3xl">
          <SheetTitle className="text-center text-2xl">{title}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-center gap-2 border-t-2 border-zinc-500">
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
