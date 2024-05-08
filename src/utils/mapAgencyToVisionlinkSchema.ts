import visionlinkSchema from '@/utils/visionlinkSchema';
import { Agency as AgencyModel, Day as DayModel } from '@/utils/types';
import { z } from 'zod';

function mapLegalStatus(status: string): { id: number; label: string } {
  switch (status) {
    case 'Federal':
      return { id: 64, label: 'Government -- Federal' };
    case 'State':
      return { id: 67, label: 'Government -- State' };
    case 'County':
      return { id: 63, label: 'Government -- County' };
    case 'City':
      return { id: 62, label: 'Government -- City' };
    case 'Non-Profit':
      return { id: 57, label: 'Nonprofit -- Unincorporated' }; // Currently assuming that the nonprofit is unincorporated even though the schema distinguishes between incorporated and unincorporated
    case '501(c)3':
      return { id: 56, label: 'Nonprofit -- Incorporated' };
    case 'Faith-based':
      return { id: 58, label: 'Faith-based' };
    case 'For profit':
      return { id: 61, label: 'Commerical' };
    default:
      return { id: -1, label: '' };
  }
}

export default function mapAgencyToVisionlinkSchema(
  agency: AgencyModel | undefined
): z.infer<typeof visionlinkSchema> {
  if (agency === undefined) throw new Error('No agency was provided.');

  return {
    Agency_Id: agency._id,
    Agency_CreateStamp: agency.createdAt?.toISOString(),
    Agency_EditStamp: agency.updatedAt?.toISOString(),
    AgencyCustom_ContactPhoneNumbers:
      agency.latestInfo?.contactInfo.additionalNumbers
        ?.map((number) => number.number)
        ?.join(','),
    ...(!agency.latestInfo?.location.confidential && {
      AgencyAddressus_AgencyAddressus: {
        address_1: agency.latestInfo?.location.physicalAddress,
        city: agency.latestInfo?.location.city,
        county: agency.latestInfo?.location.county,
        state: agency.latestInfo?.location.state,
        zip: agency.latestInfo?.location.zipCode,
      },
    }),
    ...(agency.latestInfo?.location.confidential && {
      AgencyAddressus_ConfidentialPhysicalAddress: {
        address_1: agency.latestInfo?.location.physicalAddress,
        city: agency.latestInfo?.location.city,
        county: agency.latestInfo?.location.county,
        state: agency.latestInfo?.location.state,
        zip: agency.latestInfo?.location.zipCode,
      },
    }),
    ...(!agency.latestInfo?.location.confidential && {
      AgencyAddressus_MailingAddress: {
        address_1: agency.latestInfo?.location.mailingAddress,
        city: agency.latestInfo?.location.city,
        county: agency.latestInfo?.location.county,
        state: agency.latestInfo?.location.state,
        zip: agency.latestInfo?.location.zipCode,
      },
    }),
    ...(agency.latestInfo?.location.confidential && {
      AgencyAddressus_ConfidentialMailingAddress: {
        address_1: agency.latestInfo?.location.mailingAddress,
        city: agency.latestInfo?.location.city,
        county: agency.latestInfo?.location.county,
        state: agency.latestInfo?.location.state,
        zip: agency.latestInfo?.location.zipCode,
      },
    }),
    AgencySystem_PhoneMain: agency.latestInfo?.contactInfo.phoneNumber,
    AgencySystemn_EmailAddress: agency.latestInfo?.contactInfo.email,
    AgencySystem_Fax: agency.latestInfo?.contactInfo.faxNumber,
    AgencySystem_TddPhone: agency.latestInfo?.contactInfo.TDDTTYNumber,
    AgencySystem_LastEditDate: agency.latestInfo?.updatedAt?.toISOString(),
    AgencySystem_DateOfLastCompleteUpdate:
      agency.latestInfo?.updatedAt?.toISOString(),
    AgencySystem_Aka: agency.latestInfo?.alsoKnownAs?.join(','),
    AgencySystem_Websiteurl: agency.latestInfo?.contactInfo.website,
    AgencySystem_Name: agency.latestInfo?.legalAgencyName,
    AgencySystem_Description: agency.latestInfo?.briefAgencyDescription,
    AgencySystem_PhysicalAddressConfidential:
      agency.latestInfo?.location.confidential,
    AgencySystem_MailingAddressConfidential:
      agency.latestInfo?.location.confidential,
    AgencySystem_HoursOfOperation: agency.latestInfo?.hours
      .map((day: DayModel) => `${day.day}: ${day.openTime} - ${day.closeTime}`)
      .join(','),
    AgencySystem_DirectoryPositiontitle: agency.latestInfo?.directorNameOrTitle,
    AgencySystem_DirectoryName: agency.latestInfo?.directorNameOrTitle,
    AgencySystem_LegalStatus: agency.latestInfo?.legalOrganizationalStatus.map(
      (status) => mapLegalStatus(status)
    ),

    // Currently assuming that the first service is the primary service
    // TODO: Discuss how multiple services are supported by the API

    ServiceAccount_ServiceContact: [
      {
        account_id: -1,
        account_email: agency.latestInfo?.services?.[0].contactPersonName,
      },
    ],
    ServiceOption_LanguagesOtherThanEnglish:
      agency.latestInfo?.languages.includes('Spanish')
        ? [{ id: 1, label: 'Spanish' }]
        : [],
    ServiceSystem_DocumentsRequired:
      agency.latestInfo?.services?.[0].requiredDocuments,
    ServiceSystem_FeeStructure: agency.latestInfo?.services?.[0].feeCategory,
    ServiceSystem_Description: agency.latestInfo?.services?.[0].fullDescription,
    ServiceSystem_Name: agency.latestInfo?.services?.[0].name,
    ServiceSystem_ApplicationintakeProcess:
      agency.latestInfo?.services?.[0].applicationProcess,
    ServiceSystem_HoursOfOperation: agency.latestInfo?.services?.[0].daysOpen
      .map((day: DayModel) => `${day.day}: ${day.openTime} - ${day.closeTime}`)
      .join(','),
    ServiceSystem_Eligibility:
      agency.latestInfo?.services?.[0].eligibilityRequirements,
    ServiceContact_ServiceContact: [
      {
        account_id: -1,
        account_email: agency.latestInfo?.services?.[0].contactPersonName,
      },
    ],
  } as z.infer<typeof visionlinkSchema>;
}
