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
// import { transform } from 'framer-motion';
import { useState } from 'react';

interface FormStepperSubpage {
  id: string;
  name: string;
  fields: Array<string>;
}
interface DesktopFormStepperProps {
  currentPageIndex: number;
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
  setCurrentStep: (step: number) => void;
  setCurrentSubstep: (step: number) => void;
}

const BreadItem = ({
  index,
  step,
  currentPageIndex,
  setCurrentStep,
  setCurrentSubstep,
}: StepItem) => {
  const [dropdown, setDropdown] = useState(false);

  if (step.subpages.length > 1) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            onClick={() => setDropdown(!dropdown)}
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
              >
                {subpage.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    return (
      <Button
        onClick={() => {
          setCurrentStep(index);
          setCurrentSubstep(1);
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
  formSteps,
  setCurrentStep,
  setCurrentSubstep,
}: DesktopFormStepperProps) {
  return (
    <Breadcrumb>
      {formSteps.map((step, index) => (
        <BreadcrumbItem key={index}>
          <BreadItem
            index={index}
            step={step}
            currentPageIndex={currentPageIndex}
            setCurrentStep={setCurrentStep}
            setCurrentSubstep={setCurrentSubstep}
          />
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}
