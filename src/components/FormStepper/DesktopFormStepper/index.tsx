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
interface DesktopFormStepperProps {
  currentPageIndex: number;
  formSteps: Array<{ id: string; name: string; fields: Array<string> }>;
  setCurrentStep: (step: number) => void;
}

interface StepItem {
  step: { id: string; name: string; fields: Array<string> };
  index: number;
  currentPageIndex: number;
  setCurrentStep: (step: number) => void;
}

const BreadItem = ({
  index,
  step,
  currentPageIndex,
  setCurrentStep,
}: StepItem) => {
  if (step.name === 'Preliminaries') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            // onClick={() => setCurrentStep(index)}
            className={`bg-white hover:bg-slate-200 ${
              index > currentPageIndex
                ? 'pointer-events-none text-gray-400'
                : 'text-black'
            }`}
          >
            {step.name}
            <svg
              className="ml-1 mt-0.5 h-5 w-5 text-gray-900"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>{step.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    return (
      <Button
        onClick={() => setCurrentStep(index)}
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
          />
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}
