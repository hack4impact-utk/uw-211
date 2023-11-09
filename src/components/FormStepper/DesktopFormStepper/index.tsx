import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import Link from 'next/link';

interface DesktopFormStepperProps {
  currentPageIndex: number;
}

export default function DesktopFormStepper({
  currentPageIndex,
}: DesktopFormStepperProps) {
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
    <Breadcrumb>
      {formSteps.map((step, index) => (
        <BreadcrumbItem key={index}>
          <Link
            href={step.link}
            className={`${
              index > currentPageIndex
                ? 'pointer-events-none text-gray-400'
                : 'text-black'
            }`}
          >
            {step.title}
          </Link>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}
