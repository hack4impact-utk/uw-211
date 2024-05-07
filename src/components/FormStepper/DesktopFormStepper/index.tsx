import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FormStepperSubpage {
  id: string;
  name: string;
  fields: Array<string>;
}
interface DesktopFormStepperProps {
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

interface StepItem {
  step: { id: string; name: string; subpages: Array<FormStepperSubpage> };
  index: number;
  currentPageIndex: number;
  currentSubpageIndex: number;
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
    // there are subpages
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={`bg-white hover:bg-slate-200 ${
              index > currentPageIndex
                ? 'pointer-events-none text-gray-400'
                : 'text-black'
            }`}
          >
            {step.name}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2"
            >
              <path d="M7 15l5 5 5-5" />
              <path d="M7 9l5-5 5 5" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>{step.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {step.subpages.map((subpage, subindex) => (
              <DropdownMenuItem
                onClick={() => {
                  setCurrentStep(index);
                  setCurrentSubstep(subindex);
                }}
                key={`${index}.${subindex}`}
                className={`${
                  // have not got to this subpage && have to go to page at all
                  subindex > currentSubpageIndex && index >= currentPageIndex
                    ? 'pointer-events-none text-gray-400'
                    : 'text-black'
                }`}
              >
                {subpage.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    // no subpages, return normal button
    return (
      <Button
        onClick={() => {
          setCurrentStep(index);
          setCurrentSubstep(0);
        }}
        className={`bg-white hover:bg-slate-200 ${
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

export default function DesktopFormStepper({
  currentPageIndex,
  currentSubpageIndex,
  formSteps,
  setCurrentStep,
  setCurrentSubstep,
}: DesktopFormStepperProps) {
  return (
    <Breadcrumb>
      {formSteps.map((step, index) => (
        <BreadcrumbItem key={index}>
          <StepItem
            index={index}
            step={step}
            currentPageIndex={currentPageIndex}
            currentSubpageIndex={currentSubpageIndex}
            setCurrentStep={setCurrentStep}
            setCurrentSubstep={setCurrentSubstep}
          />
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}
