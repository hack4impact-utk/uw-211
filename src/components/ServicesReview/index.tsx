'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { z } from 'zod';
import { ServiceSchema } from '@/utils/constants/formDataSchema';
import { HoursReview } from '../HoursReview';
import { useTranslations } from 'next-intl';

type Service = z.infer<typeof ServiceSchema>;
interface ServicesReviewProps {
  service: Service;
}

export function ServicesReview({ service }: ServicesReviewProps) {
  const t = useTranslations('Form.services');
  const t2 = useTranslations('Components.servicesReview');

  const app_process = new Map([
    ['walkIn', t('applicationProcess.walkIn')],
    ['telephone', t('applicationProcess.telephone')],
    ['appointment', t('applicationProcess.appointment')],
    ['online', t('applicationProcess.online')],
    ['other', t('applicationProcess.other.title')],
    ['referral', t2('referral')],
  ]);

  const fees = new Map([
    ['none', t('fees.noFees')],
    ['straight', t('fees.straight.title')],
    ['slidingScale', t('fees.slidingScale')],
    ['medicaid_tenncare', t('medicaidTenncare')],
    ['medicare', t('fees.medicare')],
    ['private', t('fees.private')],
  ]);

  const required_documents = new Map([
    ['none', t('requiredDocuments.noDocuments')],
    ['proofOfResidence', t('requiredDocuments.proofOfResidence')],
    ['medicalRecords', t('requiredDocuments.medicalRecords')],
    ['utilityBill', t('requiredDocuments.utilityBill')],
    ['proofOfPublicAssistance', t('requiredDocuments.proofOfPublicAssistance')],
    ['stateId', t('requiredDocuments.stateId')],
    ['proofOfIncome', t('requiredDocuments.proofOfIncome')],
    ['psychRecords', t('requiredDocuments.psychRecords')],
    ['utilityCutoffNotice', t('requiredDocuments.utilityCutoffNotice')],
    ['driversLicense', t('requiredDocuments.driversLicense')],
    ['ssn', t('requiredDocuments.ssn')],
    ['birthCertificate', t('requiredDocuments.birthCertificate')],
    ['proofOfNeed', t('requiredDocuments.proofOfNeed')],
    ['proofOfCitizenship', t('requiredDocuments.proofOfCitizenship')],
    ['other', t('requiredDocuments.other.title')],
  ]);

  const get_app_process = () => {
    const applicationProcess = service.applicationProcess;
    const options: string[] = [];
    let other: string = '';
    let referral: string = '';

    Object.entries(applicationProcess).forEach(([key, value]) => {
      if (value && key != 'other' && key != 'referral') {
        options.push(app_process.get(key)!);
      }
    });

    if (applicationProcess.other?.selected) {
      other = String(applicationProcess.other.content);
      options.push(t('applicationProcess.other.title'));
    }

    if (applicationProcess.referral?.required) {
      referral = String(applicationProcess.referral.content);
      options.push(t2('referral'));
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
              {t('applicationProcess.other.title')}:{' '}
              <span className="underline">{other}</span>
            </p>
          )}
          {referral != '' && (
            <p>
              {t2('referral')}: <span className="underline">{referral}</span>
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
        options.push(t('fees.straight.title'));
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
                {t('fees.straight.title')}:{' '}
                <span className="underline">{straight_fee}</span>
              </p>
            )}
          </div>
        </>
      );
    } else {
      return <p>{t2('noFees')}</p>;
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
        options.push(t('requiredDocuments.other.title'));
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
                {t('requiredDocuments.other.title')}:{' '}
                <span className="underline">{other}</span>
              </p>
            )}
          </div>
        </>
      );
    } else {
      return <p>{t2('noDocuments')}</p>;
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
              {t2('description')}
            </h3>
            <p>{service.fullDescription}</p>
          </div>

          <div>
            {service.contactPersonName == '' ? (
              <>
                <h3 className="text-base font-semibold leading-7 text-gray-400">
                  {t('contact.title')}
                </h3>

                <p className="text-md leading-6 text-gray-400">
                  {t2('noContact')}
                </p>
              </>
            ) : (
              <>
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  {t('contact.title')}
                </h3>
                <p>{service.contactPersonName}</p>
              </>
            )}
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold leading-7 text-gray-900">
              {t2('hours')}
            </h3>

            <HoursReview hours={service.daysOpen} />
          </div>

          <div>
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              {t('eligibility.title')}
            </h3>
            <p>{service.eligibilityRequirements}</p>
          </div>

          <div>
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              {t('applicationProcess.description')}
            </h3>
            {get_app_process()}
          </div>

          <div>
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              {t('fees.description')}
            </h3>
            {get_fees()}
          </div>

          <div>
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              {t('requiredDocuments.description')}
            </h3>
            {get_req_docs()}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

export default ServicesReview;
