export interface Location {
  confidential?: boolean;
  physicalAddress?: string;
  mailingAddress?: string;
  county?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface ServiceArea {
  townCity?: string;
  zipCodes?: string[];
  counties?: string[];
  statewide?: boolean;
  nationwide?: boolean;
  other?: string;
}

export interface ContactInfo {
  name?: string;
  title?: string;
  phoneNumber?: string;
  faxNumber?: string;
  tollFreeNumber?: string;
  TDDTTYNumber?: string;
  additionalNumbers?: string[];
  email?: string;
  website?: string;
  hideFromWebsite?: boolean;
}

export interface AgencyInfoForm {
  [x: string]: unknown;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  legalAgencyName: string;
  alsoKnownAs?: string[];
  legalOrganizationalStatus: (
    | 'Federal'
    | 'State'
    | 'County'
    | 'City'
    | 'Non-Profit'
    | '501(c)3'
    | 'Faith-based'
    | 'For profit'
    | string
  )[]; //other
  briefAgencyDescription: string;
  directorNameOrTitle: string;
  serviceArea: ServiceArea;
  fundingSources: (
    | 'Federal'
    | 'State'
    | 'County'
    | 'City'
    | 'Donations'
    | 'Foundations/Private Org.'
    | 'Fees/Dues'
    | 'United Way'
    | string
  )[]; // other
  location: Location;
  contactInfo: ContactInfo;
  languageTeleInterpreterService?: boolean;
  languages: ('ASL' | 'Spanish' | string)[]; // other
  languagesWithoutPriorNotice?: string[];
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
  updaterContactInfo: ContactInfo;
  services?: Service[];
  volunteerOpportunities?: boolean;
  volunteerOpportunitiesEligibility?: string;
  volunteerCoordinatorContactInfo?: ContactInfo;
  donations?: string[];
  donationPickUpLocation?: Location;
  donationCoordinatorContactInfo?: ContactInfo;
  recommendedAgencies?: string;
}

export interface Service {
  _id?: string;
  name: string;
  fullDescription: string;
  contactPersonName: string;
  daysOpen: Day[];
  eligibilityRequirements: string;
  applicationProcess: (
    | 'Walk-in'
    | 'Telephone'
    | 'Call to Schedule Appointment'
    | 'Apply Online'
    | string
  )[]; // other
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
  requiredDocuments: (
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
    | 'Drivers License'
    | string
  )[]; // other
  isSeasonal: boolean;
  seasonalStartDate?: Date;
  seasonalEndDate?: Date;
}

export interface Agency {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  info: AgencyInfoForm[];
  latestInfo?: AgencyInfoForm;
  updateScheduleInDays: number;
  emailSentTimestamp?: Date;
  currentStatus?: 'Completed' | 'Needs Review' | 'Expired';
  approvalStatus?: 'Pending' | 'Approved';
  daysSinceEmailSent?: number;
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
