import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import useTranslation from 'next-translate/useTranslation';

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
  const { t } = useTranslation('common');

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-max p-4">
          {t('form.navigateForm')}
        </Button>
      </SheetTrigger>
      <SheetContent className="z-50">
        <SheetHeader className="pb-2 text-3xl">
          <SheetTitle className="text-center text-2xl">
            {t('form.navigateForm')}
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-center gap-2">
          {formSteps.map((step, index) => {
            return (
              <Button
                onClick={() => setCurrentStep(index)}
                key={index}
                className={`bg-white text-xl hover:bg-gray-400 ${
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
