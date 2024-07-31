import { DeepPartial } from 'react-hook-form';
import { AgencyInfoForm } from '../types';
import {
  AgencyUpdateFormData,
  ServiceFormData,
} from '../types/agency-update-form';
import {
  zodFundingToTs,
  zodLanguagesToTs,
  zodServiceToTs,
} from '../conversions';

export function latestInfoToFormData(
  info: AgencyInfoForm
): DeepPartial<AgencyUpdateFormData> {
  return {
    legalName: info.legalAgencyName,
    akas: info.alsoKnownAs?.[0],
    legalStatus: info.legalOrganizationalStatus?.[0],
    directorName: info.directorNameOrTitle,
    agencyInfo: info.briefAgencyDescription,
    contactInfo: info.contactInfo,
    hours: info.hours?.map((day, index) => {
      return {
        id: index,
        day: day.day,
        openTime: day.openTime,
        closeTime: day.closeTime,
      };
    }),
    location: info.location,
    fundingSources: {
      federal: info.fundingSources?.includes('Federal'),
      state: info.fundingSources?.includes('State'),
      county: info.fundingSources?.includes('County'),
      city: info.fundingSources?.includes('City'),
      donations: info.fundingSources?.includes('Donations'),
      foundations: info.fundingSources?.includes('Foundations/Private Org.'),
      feesDues: info.fundingSources?.includes('Fees/Dues'),
      unitedWay: info.fundingSources?.includes('United Way'),
    },
    serviceArea: info.serviceArea,
    annualAgencyUpdate: info.updaterContactInfo,
    languageSupport: {
      asl: info.languages?.includes('ASL'),
      spanish: info.languages?.includes('Spanish'),
      teleinterpreterLanguageService: info?.languageTeleInterpreterService,
      // TODO: other languages
    },
    supportedLanguagesWithoutNotice: info.languagesWithoutPriorNotice,
    accessibilityADA: info?.accessibilityADA,
    // services: info.services,
    services:
      info.services === undefined
        ? []
        : info.services.map((data, index) => {
            const service: ServiceFormData = {
              id: index,
              name: data.name,
              fullDescription: data.fullDescription,
              contactPersonName: data.contactPersonName,
              daysOpen: data.daysOpen.map((day, index) => {
                return {
                  id: index,
                  day: day.day,
                  openTime: day.openTime,
                  closeTime: day.closeTime,
                };
              }),
              eligibilityRequirements: data.eligibilityRequirements,
              applicationProcess: {
                walkIn: data.applicationProcess.includes('Walk-in'),
                telephone: data.applicationProcess.includes('Telephone'),
                appointment: data.applicationProcess.includes(
                  'Call to Schedule Appointment'
                ),
                online: data.applicationProcess.includes('Apply Online'),
                // TODO: applicationProcess.other
                // TODO: applicationProcess.referral
              },
              feeCategory: {
                none: data.feeCategory.includes('No Fees'),
                straight: {
                  selected: data.feeCategory.includes('Straight Fee'),
                  content: data.feeCategory.includes('Straight Fee')
                    ? data.feeStraightFeeAmount
                    : '',
                },
                slidingScale: data.feeCategory.includes('Sliding Scale'),
                medicaid_tenncare: data.feeCategory.includes(
                  'Insurance: Medicaid/TennCare'
                ),
                medicare: data.feeCategory.includes('Insurance: Medicare'),
                private: data.feeCategory.includes('Insurance: Private'),
              },
              requiredDocuments: {
                none: data.requiredDocuments.includes('No Documents'),
                stateId: data.requiredDocuments.includes('State Issued ID'),
                ssn: data.requiredDocuments.includes('Social Security Card'),
                proofOfResidence:
                  data.requiredDocuments.includes('Proof of Residence'),
                proofOfIncome:
                  data.requiredDocuments.includes('Proof of Income'),
                birthCertificate:
                  data.requiredDocuments.includes('Birth Certificate'),
                medicalRecords:
                  data.requiredDocuments.includes('Medical Records'),
                psychRecords: data.requiredDocuments.includes('Psych Records'),
                proofOfNeed: data.requiredDocuments.includes('Proof of Need'),
                utilityBill: data.requiredDocuments.includes('Utility Bill'),
                utilityCutoffNotice: data.requiredDocuments.includes(
                  'Utility Cutoff Notice'
                ),
                proofOfCitizenship: data.requiredDocuments.includes(
                  'Proof of Citizenship'
                ),
                proofOfPublicAssistance: data.requiredDocuments.includes(
                  'Proof of Public Assistance'
                ),
                driversLicense:
                  data.requiredDocuments.includes('Drivers License'),
                // TODO: requiredDocuments.other
              },
              isSeasonal: data.isSeasonal,
            };
            return service;
          }),
    volunteerFields: {
      // TODO: volunteers gets set here but is not reflected on webpage
      volunteers: info?.volunteerOpportunities ? 'true' : 'false',
      vol_reqs: info?.volunteerOpportunitiesEligibility,
      vol_coor: info?.volunteerCoordinatorContactInfo?.name,
      vol_coor_tel: info?.volunteerCoordinatorContactInfo?.phoneNumber,
    },
    donationFields: {
      // TODO: donation gets set here but is not reflected on webpage
      donation:
        info?.donations !== undefined && info?.donations?.length > 0
          ? 'true'
          : 'false',
      don_ex: info?.donations?.reduce((acc, curr) => acc + ', ' + curr, ''),
      pickup: info?.donationPickUpLocation !== undefined ? 'true' : 'false',
      pickup_loc: 'here',
      don_coor: info?.donationCoordinatorContactInfo?.name,
      don_coor_tel: info?.donationCoordinatorContactInfo?.phoneNumber,
    },
  };
}

export function formDataToInfo(data: AgencyUpdateFormData): AgencyInfoForm {
  return {
    legalAgencyName: data.legalName,
    alsoKnownAs: data.akas.split(' '),
    legalOrganizationalStatus: data.legalStatus.split(' '),
    briefAgencyDescription: data.agencyInfo,
    directorNameOrTitle: data.directorName,
    serviceArea: data.serviceArea,
    contactInfo: data.contactInfo,
    hours: data.hours?.map((day) => {
      return {
        day: day.day,
        openTime: day.openTime,
        closeTime: day.closeTime,
      };
    }),
    location: data.location,
    fundingSources: zodFundingToTs(data),
    updaterContactInfo: data.annualAgencyUpdate,
    languages: zodLanguagesToTs(data),
    languagesWithoutPriorNotice: data.supportedLanguagesWithoutNotice,
    accessibilityADA: data?.accessibilityADA,
    // services: info.services,
    services: data.services.map((service) => zodServiceToTs(service)),
    volunteerOpportunities: data.volunteerFields.volunteers == 'true',
    volunteerOpportunitiesEligibility: data.volunteerFields.vol_reqs,
    volunteerCoordinatorContactInfo: {
      name: data.volunteerFields.vol_coor,
      phoneNumber: data.volunteerFields.vol_coor_tel,
    },
    donations: data.donationFields.don_ex?.split(','), // split by comma
    donationPickUpLocation: {
      physicalAddress: 'TODO',
    },
    donationCoordinatorContactInfo: {
      name: data.donationFields.don_coor,
      phoneNumber: data.donationFields.don_coor_tel,
    },
  };
}
