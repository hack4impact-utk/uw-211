import { AgencyInfoForm } from '@/utils/types';
import { Service as ServiceModel } from '@/utils/types';
import { FormDataSchema, ServiceSchema } from './constants/formDataSchema';
import { z } from 'zod';

type Inputs = z.infer<typeof FormDataSchema>;
type Service = z.infer<typeof ServiceSchema>;

const dayMapping: {
  [key: string]:
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';
} = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

function zodApplicationToTs(
  data: Service
): (
  | 'Walk-in'
  | 'Telephone'
  | 'Call to Schedule Appointment'
  | 'Apply Online'
  | string
)[] {
  const eligibility: (
    | 'Walk-in'
    | 'Telephone'
    | 'Call to Schedule Appointment'
    | 'Apply Online'
    | string
  )[] = [];
  if (data.applicationProcess.walkIn) eligibility.push('Walk-in');
  if (data.applicationProcess.telephone) eligibility.push('Telephone');
  if (data.applicationProcess.appointment)
    eligibility.push('Call to Schedule Appointment');
  if (data.applicationProcess.online) eligibility.push('Apply Online');
  if (
    data.applicationProcess.other?.selected &&
    data.applicationProcess.other.content
  )
    eligibility.push(data.applicationProcess.other.content);
  return eligibility;
}

function zodFeeToTs(
  data: Service
):
  | 'No Fee'
  | 'Sliding Scale'
  | 'Income Based'
  | 'Fee'
  | 'Insurance: Medicaid/TennCare'
  | 'Insurance: Medicare'
  | 'Insurance: Private' {
  if (data.feeCategory.straight?.selected) return 'Fee';
  if (data.feeCategory.slidingScale) return 'Sliding Scale';
  if (data.feeCategory.medicaid_tenncare) return 'Insurance: Medicaid/TennCare';
  if (data.feeCategory.medicare) return 'Insurance: Medicare';
  if (data.feeCategory.private) return 'Insurance: Private';
  return 'No Fee';
}

function zodDocumentsToTs(data: Service): ServiceModel['requiredDocuments'] {
  const documents: ServiceModel['requiredDocuments'] = [];
  if (data.requiredDocuments.none) {
    documents.push('No Documents');
    return documents;
  }
  if (data.requiredDocuments.stateId) documents.push('State Issued ID');
  if (data.requiredDocuments.ssn) documents.push('Social Security Card');
  if (data.requiredDocuments.proofOfResidence)
    documents.push('Proof of Residence');
  if (data.requiredDocuments.proofOfIncome) documents.push('Proof of Income');
  if (data.requiredDocuments.birthCertificate)
    documents.push('Birth Certificate');
  if (data.requiredDocuments.medicalRecords) documents.push('Medical Records');
  if (data.requiredDocuments.psychRecords) documents.push('Psych Records');
  if (data.requiredDocuments.proofOfNeed) documents.push('Proof of Need');
  if (data.requiredDocuments.utilityBill) documents.push('Utility Bill');
  if (data.requiredDocuments.utilityCutoffNotice)
    documents.push('Utility Cutoff Notice');
  if (data.requiredDocuments.proofOfCitizenship)
    documents.push('Proof of Citizenship');
  if (data.requiredDocuments.proofOfPublicAssistance)
    documents.push('Proof of Public Assistance');
  if (data.requiredDocuments.driversLicense) documents.push('Drivers License');
  if (
    data.requiredDocuments.other?.selected &&
    data.requiredDocuments.other.content
  )
    documents.push(data.requiredDocuments.other.content);
  return documents;
}

function zodServiceToTs(data: Service): ServiceModel {
  const service: ServiceModel = {
    name: data.name,
    fullDescription: data.fullDescription,
    contactPersonName: data.contactPersonName,
    daysOpen: data.daysOpen.map((day) => {
      return {
        day: day.day,
        openTime: day.openTime,
        closeTime: day.closeTime,
      };
    }),
    eligibilityRequirements: data.eligibilityRequirements,
    applicationProcess: zodApplicationToTs(data),
    applicationProcessReferralRequiredByWhom: data.applicationProcess.referral
      ?.required
      ? data.applicationProcess.referral.content
      : '',
    feeCategory: zodFeeToTs(data),
    feeStraightFeeAmount: data.feeCategory.straight?.content,
    requiredDocuments: zodDocumentsToTs(data),
    isSeasonal: data.isSeasonal,
  };
  return service;
}

function zodVolCoordinatorToTs(
  data: Inputs
): AgencyInfoForm['volunteerCoordinatorContactInfo'] {
  const contactInfo: AgencyInfoForm['volunteerCoordinatorContactInfo'] = {
    name: data.volunteerFields.vol_coor,
    phoneNumber: data.volunteerFields.vol_coor_tel,
  };
  return contactInfo;
}

function zodFundingToTs(data: Inputs): AgencyInfoForm['fundingSources'] {
  const funding: AgencyInfoForm['fundingSources'] = [];

  if (data.fundingSources.federal) funding.push('Federal');
  if (data.fundingSources.state) funding.push('State');
  if (data.fundingSources.county) funding.push('County');
  if (data.fundingSources.city) funding.push('City');
  if (data.fundingSources.donations) funding.push('Donations');
  if (data.fundingSources.foundations) funding.push('Foundations/Private Org.');
  if (data.fundingSources.feesDues) funding.push('Fees/Dues');
  if (data.fundingSources.unitedWay) funding.push('United Way');
  if (data.fundingSources.other?.selected && data.fundingSources.other.content)
    funding.push(data.fundingSources.other.content);
  return funding;
}

function zodLanguagesToTs(data: Inputs): AgencyInfoForm['languages'] {
  const languages: AgencyInfoForm['languages'] = [];

  if (data.languageSupport.asl) languages.push('ASL');
  if (data.languageSupport.spanish) languages.push('Spanish');
  if (
    data.languageSupport.other?.selected &&
    data.languageSupport.other.content
  ) {
    data.languageSupport.other.content.forEach((element) => {
      languages.push(element);
    });
  }
  return languages;
}

export function zodFormToTs(data: Inputs): AgencyInfoForm {
  const agencyInfo: AgencyInfoForm = {
    legalAgencyName: data.legalName,
    alsoKnownAs: data.akas.split(' '),
    legalOrganizationalStatus: data.legalStatus.split(' '),
    briefAgencyDescription: data.agencyInfo,
    directorNameOrTitle: data.directorName,
    serviceArea: data.serviceArea || {},
    fundingSources: zodFundingToTs(data) || [],
    location: data.location || {
      physicalAddress: 'The zod schema/front end need to collect an address',
    },
    contactInfo: data.contactInfo || {
      phoneNumber: 'The zod schema/front end need to collect a phone number',
    },
    languageTeleInterpreterService:
      data.languageSupport.teleinterpreterLanguageService,
    languages: zodLanguagesToTs(data) || [],
    languagesWithoutPriorNotice: data.supportedLanguagesWithoutNotice,
    accessibilityADA: data.accessibilityADA,
    regularHoursOpening: data.hours.open,
    regularHoursClosing: data.hours.close,
    regularDaysOpen: Object.entries(data.days)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => value)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(([key, _]) => dayMapping[key]),
    updaterContactInfo: data.updaterContactInfo || {
      phoneNumber: 'The zod schema/front end need to collect a phone number',
    },
    services: data.services.map((service) => zodServiceToTs(service)),
    volunteerOpportunities: data.volunteerFields.volunteers == 'true',
    volunteerOpportunitiesEligibility: data.volunteerFields.vol_reqs,
    volunteerCoordinatorContactInfo: zodVolCoordinatorToTs(data),
    donations: data.donationFields.don_ex?.split(','), // split by comma
    donationPickUpLocation: {
      physicalAddress: 'The zod schema/front end need to collect an address',
    },
    donationCoordinatorContactInfo: {
      name: data.donationFields.don_coor,
      phoneNumber: data.donationFields.don_coor_tel,
    },
  };
  return agencyInfo;
}
