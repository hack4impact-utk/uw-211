import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';

interface MobileFormStepperProps {
  currentPageIndex: number;
}

export default function MobileFormStepper({
  currentPageIndex,
}: MobileFormStepperProps) {
  const formSteps = [
    {
      title: 'Preliminaries',
      link: '/',
    },
    {
      title: 'Services',
      link: '/',
    },
    {
      title: 'Opportunities',
      link: '/',
    },
    {
      title: 'Four',
      link: '/',
    },
    {
      title: 'Five',
      link: '/',
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="pb-2">
          <SheetTitle>Navigate Form</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-center gap-2">
          {formSteps.map((step, index) => {
            return (
              <Link
                href={step.link}
                key={index}
                className={`${
                  index > currentPageIndex ? 'text-gray-400' : 'text-black'
                }`}
              >
                {step.title}
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
