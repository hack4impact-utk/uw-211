import { Agency } from '@/utils/types';
export const testAgency: Agency = {
  name: 'This is another agency',
  info: [
    {
      approved: false,
      legalAgencyName: 'This is another agency',
      alsoKnownAs: [],
      legalOrganizationalStatus: ['Non-profit'],
      briefAgencyDescription:
        'Non-profit organization providing community services.',
      directorNameOrTitle: 'bob',
      serviceArea: {
        townCity: 'Knoxville',
        zipCodes: ['37916'],
        counties: ['Knox'],
        statewide: true,
        nationwide: false,
      },
      fundingSources: ['Federal', 'Donations'],
      location: {
        confidential: false,
        physicalAddress: '123 Main St',
        county: 'Knox',
        city: 'Knoxville',
        state: 'Tennessee',
        zipCode: '37996',
      },
      languageTeleInterpreterService: true,
      languages: ['Spanish', 'ASL'],
      languagesWithoutPriorNotice: ['French', 'Russian'],
      accessibilityADA: true,
      hours: [
        {
          day: 'Monday',
          openTime: '9:00 AM',
          closeTime: '5:00 PM',
        },
        {
          day: 'Tuesday',
          openTime: '9:00 AM',
          closeTime: '5:00 PM',
        },
        {
          day: 'Wednesday',
          openTime: '9:00 AM',
          closeTime: '5:00 PM',
        },
        {
          day: 'Thursday',
          openTime: '9:00 AM',
          closeTime: '5:00 PM',
        },
        {
          day: 'Friday',
          openTime: '9:00 AM',
          closeTime: '5:00 PM',
        },
      ],
      updaterContactInfo: {
        name: 'Billy',
        title: 'Guy',
        phoneNumber: '555-555-5555',
        faxNumber: '555-555-5556',
        email: 'info@coolservice.org',
        hideFromWebsite: false,
        additionalNumbers: [],
      },
      services: [
        {
          name: 'Testing name',
          fullDescription: 'hi this a description.',
          contactPersonName: 'Emma',
          daysOpen: [
            {
              day: 'Monday',
              openTime: '9:00 AM',
              closeTime: '5:00 PM',
            },
            {
              day: 'Wednesday',
              openTime: '10:00 AM',
              closeTime: '6:00 PM',
            },
            {
              day: 'Friday',
              openTime: '8:30 AM',
              closeTime: '4:30 PM',
            },
          ],
          eligibilityRequirements: 'Must have an annual income below $20,000.',
          applicationProcess: ['Walk-in'],
          applicationProcessReferralRequiredByWhom: 'No referral required',
          feeCategory: 'No Fee',
          requiredDocuments: ['State Issued I.D.'],
          isSeasonal: true,
          // Set seasonalStartDate 22 days in the future
          seasonalStartDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 22),
        },
      ],
      volunteerOpportunities: false,
      volunteerOpportunitiesEligibility: '18 years and older',
      volunteerCoordinatorContactInfo: {
        name: 'Billy',
        title: 'Guy',
        phoneNumber: '555-555-5555',
        faxNumber: '555-555-5556',
        email: 'info@coolservice.org',
        hideFromWebsite: false,
        additionalNumbers: [],
      },
      donations: [
        'Non-perishable food items, warm clothing, and hygiene products',
      ],
      contactInfo: {
        phoneNumber: '555-555-5555',
        faxNumber: '555-555-5556',
        tollFreeNumber: '1-800-123-4567',
        TDDTTYNumber: '555-555-5557',
        additionalNumbers: [
          {
            id: 12345,
            label: 'first',
            number: '555-555-5558',
          },
          {
            id: 12345,
            label: 'second',
            number: '555-555-5559',
          },
        ],
        email: 'info@coolservice.org',
        website: 'https://www.coolservice.org',
      },
    },
  ],
  updateScheduleInDays: 36,
  approvalStatus: 'Pending',
  emailSentTimestamp: new Date(),
};
