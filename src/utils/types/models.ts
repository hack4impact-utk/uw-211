import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export interface Agency extends Document {
  createdAt: Date;
  updatedAt: Date;
  legalAgencyName: string;
  alsoKnownAs?: string[];
  legalOrganizationalStatus: string[];
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
  services?: Service[];
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
  emailSentTimestamp?: Date;
  currentStatus: 'Completed' | 'Needs Review' | 'Expired';
  daysSinceEmailSent?: number;
}

export interface Service extends mongoose.Document {
  fullDescription: string;
  contactPersonName: string;
  daysOpen: Day[];
  eligibilityRequirements: string;
  applicationProcess:
    | 'Walk-in'
    | 'Telephone'
    | 'Call to Schedule Appointment'
    | 'Apply Online';
  applicationProcessOther?: string;
  applicationProcessReferralRequiredByWhom?: string;
  feeCategory:
    | 'No Fee'
    | 'Sliding Scale'
    | 'Income Based'
    | 'Fee'
    | 'Insurance: Medicaid/TennCare'
    | 'Insurance: Medicare'
    | 'Insurance: Private';
  feeStraightFeeAmount?: string;
  requiredDocuments:
    | 'No Documents'
    | 'State Issued I.D.'
    | 'Social Security Card'
    | 'Proof of Residence'
    | 'Proof of Income'
    | 'Birth Certificate'
    | 'Medical Records'
    | 'Psych Records'
    | 'Proof of Need'
    | 'Utility Bill'
    | 'Utility Bill Cutoff Notice'
    | 'Proof of Citizenship'
    | 'Proof of Public Assistance'
    | 'Drivers License';
  requiredDocumentsOther?: string;
}

export interface Day {
  day:
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';
  openTime: string;
  closeTime: string;
}
