import { Service } from '@/app/[id]/page';

export function ServicesReview(service: Service) {
  const get_app_proccess = () => {
    const applicationProcess = service.applicationProcess;
    let options: string = '';
    let other: string = '';
    let referral: string = '';

    Object.entries(applicationProcess).forEach(([key, value]) => {
      if (value && key != 'other' && key != 'referral') {
        options += key + ', ';
      }
    });

    if (applicationProcess.other?.selected) {
      other = String(applicationProcess.other.content);
    }

    if (applicationProcess.referral?.required) {
      referral = String(applicationProcess.referral.content);
    }

    return (
      <>
        <p>{options.substring(0, options.length - 2)}</p>
        {other != '' ? <p>Other: {other}</p> : ''}
        {referral != '' ? <p>Referral: {referral}</p> : ''}
      </>
    );
  };

  return (
    <div className="flex w-full flex-col gap-1 rounded-lg border-2 border-solid p-8 md:w-5/12 lg:w-3/12 xl:w-2/12">
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        {service.name}
      </h2>
      <p>{service.description}</p>
      <p>{service.contact}</p>
      <p>{service.eligibility}</p>
      {get_app_proccess()}
    </div>
  );
}

export default ServicesReview;
