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
    let options: string = '';
    let other: string = '';
    let referral: string = '';

    Object.entries(applicationProcess).forEach(([key, value]) => {
      if (value && key != 'other' && key != 'referral') {
        options += app_proccess.get(key) + ', ';
      }
    });

    if (applicationProcess.other?.selected) {
      options += 'Other, ';
      other = String(applicationProcess.other.content);
    }

    if (applicationProcess.referral?.required) {
      options += 'Referral, ';
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
        if (value && key != 'none' && key != 'straightFee') {
          options += fees.get(key) + ', ';
        }
      });

      if (fees_array.straight?.selected) {
        options += 'Straight Fee, ';
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

  const get_req_docs = () => {
    const req_docs = service.requiredDocuments;
    let options: string = '';
    let other: string = '';

    if (req_docs.none == false) {
      Object.entries(req_docs).forEach(([key, value]) => {
        if (value && key != 'none' && key != 'other') {
          options += required_documents.get(key) + ', ';
        }
      });

      if (req_docs.other?.selected) {
        options += 'Other, ';
        other = String(req_docs.other.content);
      }

      return (
        <>
          <p>{options.substring(0, options.length - 2)}</p>
          <div className="ml-6">{other != '' ? <p>Other: {other}</p> : ''}</div>
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
              Description:
            </h3>
            <p className="text-[#d95740]">{service.description}</p>
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
                <p className="text-[#d95740]">{service.contact}</p>
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
            <p className="text-[#d95740]">{service.eligibility}</p>
          </div>

          <div>
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              How would someone apply for this service?
            </h3>
            <span className="text-[#d95740]">{get_app_proccess()}</span>
          </div>

          <div>
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Are individuals charged for your services? What is your fee
              structure?
            </h3>
            <span className="text-[#d95740]">{get_fees()}</span>
          </div>

          <div>
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              What would someone need to bring when applying?
            </h3>
            <span className="text-[#d95740]">{get_req_docs()}</span>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

export default ServicesReview;
