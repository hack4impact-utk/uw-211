import ServicesReview from '@/components/ServicesReview';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useWindowSize } from '@/utils/hooks/useWindowSize';
import {
  ServiceFormData,
  ServicesFormData,
} from '@/utils/types/agency-update-form';
import { useTranslations } from 'next-intl';

interface ReviewServicesSectionProps {
  formData: ServicesFormData;
}

export default function ReviewServicesSection({
  formData,
}: ReviewServicesSectionProps) {
  const t = useTranslations('Form');
  const { width: screenWidth } = useWindowSize();

  const getServices = () => {
    const services = formData.services;

    let serviceItems = [];

    if (
      (screenWidth < 720 && formData.services.length > 1) ||
      formData.services.length > 2
    ) {
      serviceItems = services.map((service: ServiceFormData, index: number) => (
        <CarouselItem className="lg:basis-1/2" key={index}>
          {<ServicesReview service={service} />}
        </CarouselItem>
      ));
    } else {
      serviceItems = services.map((service: ServiceFormData, index: number) => (
        <div className="w-full lg:w-1/2" key={index}>
          {<ServicesReview service={service} />}
        </div>
      ));
    }

    return serviceItems;
  };

  return (
    <section>
      <h2 className="mb-4 text-base font-semibold leading-7 text-gray-900 underline underline-offset-2">
        {t('services.title')}
      </h2>

      {formData.services.length === 0 ? (
        <p className="text-md leading-6 text-gray-400">No services listed.</p>
      ) : (screenWidth < 720 && formData.services.length > 1) ||
        formData.services.length > 2 ? (
        <Carousel
          opts={{
            align: 'start',
          }}
        >
          <CarouselContent>{getServices()}</CarouselContent>
          <CarouselNext
            className="right-1/3 top-full mt-8 sm:-right-12 sm:top-1/2 sm:-translate-y-1/2"
            type="button"
          />
          <CarouselPrevious
            className="left-1/3 top-full mt-8 sm:-left-12 sm:top-1/2 sm:-translate-y-1/2"
            type="button"
          />
        </Carousel>
      ) : (
        <div className="flex w-full flex-col gap-4 md:flex-row">
          {getServices()}
        </div>
      )}

      {/* {screenWidth < 720 && formData.services.length > 2 ? (
      <Carousel
        opts={{
          align: 'start',
        }}
      >
        <CarouselContent>{getServices()}</CarouselContent>
        <CarouselNext
          className="right-1/3 top-full mt-8 sm:-right-12 sm:top-1/2 sm:-translate-y-1/2"
          type="button"
        />
        <CarouselPrevious
          className="left-1/3 top-full mt-8 sm:-left-12 sm:top-1/2 sm:-translate-y-1/2"
          type="button"
        />
      </Carousel>
    ) : formData.services.length === 0 ? (
      <p className="text-md leading-6 text-gray-400">
        {t('review.no-services')}
      </p>
    ) : (
      <div className="flex w-full flex-col gap-4 md:flex-row">
        {getServices()}
      </div>
    )} */}
    </section>
  );
}
