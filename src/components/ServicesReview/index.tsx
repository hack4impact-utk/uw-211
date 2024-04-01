import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { z } from 'zod';
import { ServiceSchema } from '@/utils/constants/formDataSchema';

type Service = z.infer<typeof ServiceSchema>;

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

  const required_documents = new Map([
    ['none', 'No Documents'],
    ['proofOfResidence', 'Proof of Residence'],
    ['medicalRecords', 'Medical Records'],
    ['utilityBill', 'Utility Bill'],
    ['proofOfPublicAssistance', 'Proof of Public Assistance'],
    ['stateId', 'State Issued ID'],
    ['proofOfIncome', 'Proof of Income'],
    ['psychRecords', 'Psych Records'],
    ['utilityCutoffNotice', 'Utility Cutoff Notice'],
    ['driversLicense', "Driver's License"],
    ['ssn', 'Social Security Card'],
    ['birthCertificate', 'Birth Certificate'],
    ['proofOfNeed', 'Proof of Need'],
    ['proofOfCitizenship', 'Proof of Citizenship'],
    ['other', 'Other'],
  ]);

  const get_app_proccess = () => {
    const applicationProcess = service.applicationProcess;
    const options: string[] = [];
    let other: string = '';
    let referral: string = '';

    Object.entries(applicationProcess).forEach(([key, value]) => {
      if (value && key != 'other' && key != 'referral') {
        options.push(app_proccess.get(key)!);
      }
    });

    if (applicationProcess.other?.selected) {
      other = String(applicationProcess.other.content);
      options.push('Other');
    }

    if (applicationProcess.referral?.required) {
      referral = String(applicationProcess.referral.content);
      options.push('Referral');
    }

    return (
      <>
        <p>
          {options.map((item, index) => (
            <span key={index}>
              {item}
              {index !== options.length - 1 && ', '}
            </span>
          ))}
        </p>
        <div className="ml-6">
          {other != '' && (
            <p>
              Other: <span className="underline">{other}</span>
            </p>
          )}
          {referral != '' && (
            <p>
              Referral: <span className="underline">{referral}</span>
            </p>
          )}
        </div>
      </>
    );
  };

  const get_fees = () => {
    const fees_array = service.feeCategory;
    const options: string[] = [];
    let straight_fee: string = '';

    if (fees_array.none == false) {
      Object.entries(fees_array).forEach(([key, value]) => {
        if (value && key != 'none' && key != 'straight') {
          options.push(fees.get(key)!);
        }
      });

      if (fees_array.straight?.selected) {
        straight_fee = String(fees_array.straight.content);
        options.push('Straight Fee');
      }

      return (
        <>
          <p>
            {options.map((item, index) => (
              <span key={index}>
                {item}
                {index !== options.length - 1 && ', '}
              </span>
            ))}
          </p>

          <div className="ml-6">
            {straight_fee != '' && (
              <p>
                Straight Fee: <span className="underline">{straight_fee}</span>
              </p>
            )}
          </div>
        </>
      );
    } else {
      return <p>No fees required.</p>;
    }
  };

  const get_req_docs = () => {
    const req_docs = service.requiredDocuments;
    const options: string[] = [];
    let other: string = '';

    if (req_docs.none == false) {
      Object.entries(req_docs).forEach(([key, value]) => {
        if (value && key != 'none' && key != 'other') {
          options.push(required_documents.get(key)!);
        }
      });

      if (req_docs.other?.selected) {
        other = String(req_docs.other.content);
        options.push('Other');
      }

      return (
        <>
          <p>
            {options.map((item, index) => (
              <span key={index}>
                {item}
                {index !== options.length - 1 && ', '}
              </span>
            ))}
          </p>
          <div className="ml-6">
            {other != '' && (
              <p>
                Other: <span className="underline">{other}</span>
              </p>
            )}
          </div>
        </>
      );
    } else {
      return <p>No documents required.</p>;
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
              Description
            </h3>
            <p>{service.fullDescription}</p>
          </div>

          <div>
            {service.contactPersonName == '' ? (
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
                <p>{service.contactPersonName}</p>
              </>
            )}
          </div>

          {/* TODO */}
          <div>
            <span className="bg-blue-500 text-white">TODO: Hours</span>
          </div>

          <div>
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              How would someone apply for this service?
            </h3>
            <p>{service.eligibilityRequirements}</p>
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

          <div>
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              What would someone need to bring when applying?
            </h3>
            {get_req_docs()}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

export default ServicesReview;
