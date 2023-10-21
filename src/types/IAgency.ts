import { Document } from 'mongoose';
import { IService } from '@/types/IService';
export interface IAgency extends Document {
  createdAt: Date;
  updatedAt: Date;
  legalAgencyName: string;
  alsoKnownAs?: string[];
  legalOrganizationalStatus:
    | 'Federal'
    | 'State'
    | 'County'
    | 'City'
    | 'Non-Profit'
    | '501(c)3'
    | 'Faith-based'
    | 'For Profit'
    | 'Other';
  briefAgencyDescription: string;
  directorNameOrTitle: string;
  serviceAreaCityState?: string;
  serviceAreaZipCodes?: string[];
  serviceAreaCounties?: string[];
  serviceAreaStatewide?: boolean;
  serviceAreaNationwide?: boolean;
  serviceAreaOther?: string;
  fundingSources:
    | 'Federal'
    | 'State'
    | 'County'
    | 'City'
    | 'Donations'
    | 'Foundations/Private Org.'
    | 'Fees/Dues'
    | 'United Way'
    | 'Other';
  fundingSourcesOther?: string;
  mailingAddress?: string;
  physicalAddressConfidential: boolean;
  physicalAddressStreet: string;
  physicalAddressCounty: string;
  physicalAddressCity: string;
  physicalAddressState: string;
  physicalAddressZipCode: string;
  contactMainPhoneNumber: string;
  contactFaxNumber?: string;
  contactTollFreeNumber?: string;
  contactTDDTTYNumber?: string;
  contactAdditionalNumbers?: string[];
  contactEmail: string;
  websiteURL?: string;
  languageASL?: boolean;
  languageSpanish?: boolean;
  languageTeleInterpreterService?: boolean;
  languageOthers?: string[];
  languageWithoutPriorNotice?: string[];
  accessibilityADA?: boolean;
  regularHoursOpening?: string;
  regularHoursClosing?: string;
  regularDaysOpen: (
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday'
  )[];
  contactForAnnualUpdateName: string;
  contactForAnunualUpdateTitle: string;
  contactForAnunualUpdatePhoneNumber: string;
  contactForAnunualUpdateEmail: string;
  contactForAnnualUpdateHidden?: boolean;
  services?: IService[];
  volunteerOpportunities?: boolean;
  volunteerOpportunitiesEligibility?: string;
  volunteerCoordinarorName?: string;
  volunteerCoordinatorPhoneNumber?: string;
  donationRequirements?: string;
  donationPickup?: boolean;
  donationPickupServiceArea?: string;
  donationCoordinatorName?: string;
  donationCoordinatorPhoneNumber?: string;
  updateScheduleInDays: number;
  currentStatus: 'Completed' | 'Needs Review' | 'Expired';
}
