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
  locations?: Location[];
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

export interface Agency {
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
  // languageASL?: boolean;
  // languageSpanish?: boolean;
  // languageTeleInterpreterService?: boolean;
  // languageOthers?: string[];
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
  updateScheduleInDays: number;
  emailSentTimestamp?: Date;
  currentStatus?: 'Completed' | 'Needs Review' | 'Expired';
  daysSinceEmailSent?: number;
}

export interface Service {
  _id?: string;
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
