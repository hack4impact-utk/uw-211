import { Button } from '@/components/ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DeepPartial, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ServicesForm from './ServiceForm';
import useServices from './use-services';
import { useWindowSize } from '@/utils/hooks/useWindowSize';
import {
  ServicesFormData,
  zServicesFormData,
  ServiceFormData,
} from '@/utils/types/agency-update-form';
import { useContext, useEffect } from 'react';
import { FormContext } from '../FormContext';

interface ServicesSectionProps {
  defaultValues?: DeepPartial<ServicesFormData>;
}

export default function ServicesSection({
  defaultValues,
}: ServicesSectionProps) {
  const { width: screenWidth } = useWindowSize();
  const t = useTranslations('Form');
  const useFormResult = useForm<ServicesFormData>({
    resolver: zodResolver(zServicesFormData),
    defaultValues,
  });
  const { addService, deleteService, serviceIdx, setServiceIdx } =
    useServices(useFormResult);

  const { registerNextMiddleware, stepDelta, updateFormData } =
    useContext(FormContext);

  const {
    getValues,
    trigger,
    formState: { errors },
  } = useFormResult;

  const beforeNext = async () => {
    const output = await trigger(undefined, { shouldFocus: true });
    if (!output) return false;

    updateFormData(getValues());
    return true;
  };

  useEffect(() => {
    registerNextMiddleware('Step 3.1', beforeNext);
  }, []);

  return (
    <motion.div
      initial={{
        x: stepDelta >= 0 ? '50%' : '-50%',
        opacity: 0,
      }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Services Subpage */}
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        {t('services.title')}
      </h2>
      {screenWidth >= 1100 ? (
        <ResizablePanelGroup
          direction="horizontal"
          className="rounded-lg border"
        >
          <ResizablePanel defaultSize={20}>
            <div className="mt-2 flex flex-col px-4 py-2">
              {/* Fix the height to be dynamic */}
              <ScrollArea className="flex h-80 flex-col">
                {getValues('services').map(
                  (service: ServiceFormData, idx: number) => (
                    <div key={service.id} className="flex flex-row">
                      <Button
                        onClick={() =>
                          setServiceIdx(
                            getValues('services').findIndex(
                              (i) => i.id === service.id
                            )
                          )
                        }
                        className="m-1 flex-grow"
                        variant={
                          getValues(`services.${serviceIdx}.id`) === service.id
                            ? 'default'
                            : 'outline'
                        }
                        error={
                          !!errors.services?.[idx] &&
                          getValues(`services.${serviceIdx}.id`) !== service.id
                        }
                        type="button"
                      >
                        {service.name}
                      </Button>
                      <Button
                        variant={
                          getValues(`services.${serviceIdx}.id`) === service.id
                            ? 'default'
                            : 'outline'
                        }
                        size="icon"
                        className="m-1"
                        onClick={() => deleteService(service.id)}
                        type="button"
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  )
                )}
              </ScrollArea>
              <Separator className="my-2" />
              <Button
                className="m-1"
                variant="outline"
                onClick={addService}
                type="button"
              >
                <Plus size={16} className="mr-2" />
                {t('services.ui.addService')}
              </Button>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80}>
            {serviceIdx === -1 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-gray-600">
                  {t('services.ui.instructions.desktop')}
                </p>
              </div>
            ) : (
              /* Fix the height to be dynamic */
              <ScrollArea className="h-96">
                <ServicesForm
                  serviceIdx={serviceIdx}
                  useFormResult={useFormResult}
                />
              </ScrollArea>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="flex flex-col">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="mx-4" type="button">
                {t('services.ui.mobileList')}
              </Button>
            </SheetTrigger>
            <SheetContent className="z-50">
              <SheetHeader className="pb-2 text-3xl">
                <SheetTitle className="text-center text-2xl">
                  {t('services.ui.mobileList')}
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col justify-center gap-2">
                <Button
                  className="m-1"
                  variant="outline"
                  onClick={addService}
                  type="button"
                >
                  <Plus size={16} className="mr-2" />
                  {t('services.ui.addService')}
                </Button>
                <Separator className="my-2" />
                {getValues('services').map(
                  (service: ServiceFormData, idx: number) => (
                    <div key={service.id} className="flex flex-row">
                      <Button
                        onClick={() => setServiceIdx(idx)}
                        className="m-1 flex-grow"
                        variant={
                          getValues(`services.${serviceIdx}.id`) === service.id
                            ? 'default'
                            : 'outline'
                        }
                        type="button"
                      >
                        {service.name}
                      </Button>
                      <Button
                        variant={
                          getValues(`services.${serviceIdx}.id`) === service.id
                            ? 'default'
                            : 'outline'
                        }
                        size="icon"
                        className="m-1"
                        onClick={() => deleteService(service.id)}
                        type="button"
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>
                  )
                )}
              </div>
            </SheetContent>
          </Sheet>
          {serviceIdx === -1 ? (
            <div className="flex h-full items-center justify-center p-5">
              <p className="text-sm text-gray-600">
                {t('services.ui.instructions.mobile')}
              </p>
            </div>
          ) : (
            <ServicesForm
              serviceIdx={serviceIdx}
              useFormResult={useFormResult}
            />
          )}
        </div>
      )}
    </motion.div>
  );
}
