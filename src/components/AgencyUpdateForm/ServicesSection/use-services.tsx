import { useForm } from 'react-hook-form';
import {
  ServiceFormData,
  ServicesFormData,
} from '../../../utils/types/agency-update-form/services';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function useServices(
  useFormResult: ReturnType<typeof useForm<ServicesFormData>>
) {
  const { getValues, setValue } = useFormResult;
  const t = useTranslations('Form');
  const [serviceIdx, setServiceIdx] = useState(-1);
  // TODO: THIS IS TERRIBLE!!!! WHY ARE WE DOING THIS IN AN EFFECT?!
  useEffect(() => {
    setValue(`services.${serviceIdx}`, getValues(`services.${serviceIdx}`));
  }, [getValues, serviceIdx, setValue]);

  const addService = () => {
    const idx = getValues('services').length;
    const newService: ServiceFormData = {
      name: t('services.name.placeholder', {
        number: getValues('services').length + 1,
      }),
      id: Date.now(),
      contactPersonName: '',
      daysOpen: [],
      fullDescription: '',
      eligibilityRequirements: '',
      applicationProcess: {
        walkIn: false,
        telephone: false,
        appointment: false,
        online: false,
        other: {
          selected: false,
          content: '',
        },
        referral: {
          required: false,
          content: '',
        },
      },
      feeCategory: {
        none: false,
        straight: {
          selected: false,
          content: '',
        },
        slidingScale: false,
        medicaid_tenncare: false,
        medicare: false,
        private: false,
      },
      requiredDocuments: {
        none: false,
        stateId: false,
        ssn: false,
        proofOfResidence: false,
        proofOfIncome: false,
        birthCertificate: false,
        medicalRecords: false,
        psychRecords: false,
        proofOfNeed: false,
        utilityBill: false,
        utilityCutoffNotice: false,
        proofOfCitizenship: false,
        proofOfPublicAssistance: false,
        driversLicense: false,
        other: {
          selected: false,
          content: '',
        },
      },
      isSeasonal: false,
    };

    getValues('services').push(newService);
    setServiceIdx(idx);
  };

  const deleteService = (id: number) => {
    const deleteIdx = getValues('services').findIndex(
      (service: ServiceFormData) => service.id === id
    );
    getValues('services').splice(deleteIdx, 1);

    if (serviceIdx === deleteIdx) {
      setServiceIdx(-1);
    } else if (serviceIdx > deleteIdx) {
      setServiceIdx(serviceIdx - 1);
    }
  };

  return {
    addService,
    deleteService,
    serviceIdx,
    setServiceIdx,
  };
}
