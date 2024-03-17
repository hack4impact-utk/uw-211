import { Service } from '@/app/[id]/page';
import {
  Card,
  CardHeader,
  // CardFooter,
  CardTitle,
  // CardDescription,
  CardContent,
} from '@/components/ui/card';

export function ServicesReview(service: Service) {
  const app_proccess = new Map([
    ['walkIn', 'Walk-in'],
    ['telephone', 'Telephone'],
    ['appointment', 'Call to Schedule an Appointment'],
    ['online', 'Apply Online'],
    ['other', 'Other'],
    ['referral', 'Referral'],
  ]);

  const fees = new Map([
    ['none', 'No Fees'],
    ['straight', 'Straight Fee'],
    ['slidingScale', 'Sliding Scale Fee'],
    ['medicaid_tenncare', 'Medicaid/TennCare'],
    ['medicare', 'Medicare'],
    ['private', 'Private Insurance'],
  ]);

  const get_app_proccess = () => {
    const applicationProcess = service.applicationProcess;
    let options: string = '';
    let other: string = '';
    let referral: string = '';

    Object.entries(applicationProcess).forEach(([key, value]) => {
      if (value) {
        options += app_proccess.get(key) + ', ';
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
        <div className="ml-6">
          {other != '' ? <p>Other: {other}</p> : ''}
          {referral != '' ? <p>Referral: {referral}</p> : ''}
        </div>
      </>
    );
  };

  const get_fees = () => {
    const fees_array = service.fees;
    let options: string = '';
    let straight_fee: string = '';

    if (fees_array.none == false) {
      Object.entries(fees_array).forEach(([key, value]) => {
        if (value && key != 'none') {
          options += fees.get(key) + ', ';
        }
      });

      if (fees_array.straight?.selected) {
        straight_fee = String(fees_array.straight.content);
      }

      return (
        <>
          <p>{options.substring(0, options.length - 2)}</p>
          <div className="ml-6">
            {straight_fee != '' ? <p>Straight Fee: {straight_fee}</p> : ''}
          </div>
        </>
      );
    } else {
      return <p>No fees required.</p>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <section className="flex flex-col gap-4">
          <div>
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Description:
            </h3>
            <p>{service.description}</p>
          </div>

          <div>
            {service.contact == '' ? (
              <>
                <h3 className="text-base font-semibold leading-7 text-gray-400">
                  Contact Person
                </h3>

                <p className="text-md leading-6 text-gray-400">
                  Contact does not differ from agency director or between
                  services.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Contact Person
                </h3>
                <p>{service.contact}</p>
              </>
            )}
          </div>

          <div>
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              How would someone apply for this service?
            </h3>
            <p>{service.eligibility}</p>
          </div>

          <div>
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              How would someone apply for this service?
            </h3>
            {get_app_proccess()}
          </div>

          <div>
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Are individuals charged for your services? What is your fee
              structure?
            </h3>
            {get_fees()}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

export default ServicesReview;
