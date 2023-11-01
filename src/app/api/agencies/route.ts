import {
  getAgencies,
  createService,
  createAgency,
} from '@/server/actions/Agencies';
import '@/server/models/Service';
import { Agency, Service } from '@/utils/types';
import { ApiError } from '@/utils/types';
import ServiceSchema from '@/server/models/Service';

export async function GET() {
  try {
    const agencies = await getAgencies();
    const filteredAgencies = agencies.map((agency) => ({
      legalAgencyName: agency.legalAgencyName,
      contactEmail: agency.contactEmail,
      currentStatus: agency.currentStatus,
      daysSinceEmailSent: agency.daysSinceEmailSent,
    }));
    return Response.json(filteredAgencies);
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function PUT() {
  const service = {
    fullDescription:
      'Provides free medical check-ups for low-income individuals.',
    contactPersonName: 'Dr. Sarah Johnson',
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
    applicationProcess: 'Walk-in',
    applicationProcessReferralRequiredByWhom: 'No referral required',
    feeCategory: 'No Fee',
    requiredDocuments: 'State Issued I.D.',
    requiredDocumentsOther: 'Proof of residence may be required.',
  };
  try {
    const s = new ServiceSchema(service);
    await s.save();
    //const savedService = await createService(service as Service);
  } catch (error) {
    console.error(error);
  }
}

export async function POST() {
  const service: Service = {
    fullDescription:
      'Provides free medical check-ups for low-income individuals.',
    contactPersonName: 'Dr. Sarah Johnson',
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
    applicationProcess: 'Walk-in',
    applicationProcessReferralRequiredByWhom: 'No referral required',
    feeCategory: 'No Fee',
    requiredDocuments: 'State Issued I.D.',
    requiredDocumentsOther: 'Proof of residence may be required.',
  };
  const savedService = await createService(service);
  const agency: Agency = {
    legalAgencyName: 'ABC Community Services',
    alsoKnownAs: ['XYZ Outreach', 'Community Aid Center'],
    legalOrganizationalStatus: ['Non-Profit'],
    briefAgencyDescription:
      'A community-based organization providing essential services to those in need.',
    directorNameOrTitle: 'John Smith',
    serviceAreaCityState: 'New York, NY',
    serviceAreaZipCodes: ['10001', '10002'],
    serviceAreaCounties: ['New York County'],
    serviceAreaStatewide: false,
    serviceAreaNationwide: true,
    serviceAreaOther: 'International outreach programs in select countries.',
    fundingSources: 'Federal',
    fundingSourcesOther: 'Grants',
    mailingAddress: '123 Main Street, Suite 456',
    physicalAddressConfidential: false,
    physicalAddressStreet: '456 Oak Avenue',
    physicalAddressCounty: 'New York County',
    physicalAddressCity: 'New York',
    physicalAddressState: 'NY',
    physicalAddressZipCode: '10003',
    contactMainPhoneNumber: '555-555-5555',
    contactFaxNumber: '555-555-5556',
    contactTollFreeNumber: '1-800-123-4567',
    contactTDDTTYNumber: '555-555-5557',
    contactAdditionalNumbers: ['555-555-5558', '555-555-5559'],
    contactEmail: 'info@abccommunityservices.org',
    websiteURL: 'http://www.abccommunityservices.org',
    languageASL: true,
    languageSpanish: true,
    languageTeleInterpreterService: true,
    languageOthers: ['Chinese', 'Arabic'],
    languageWithoutPriorNotice: ['French', 'Russian'],
    accessibilityADA: true,
    regularHoursOpening: '9:00 AM',
    regularHoursClosing: '5:00 PM',
    regularDaysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    contactForAnnualUpdateName: 'Jane Doe',
    contactForAnunualUpdateTitle: 'Public Relations Manager',
    contactForAnunualUpdatePhoneNumber: '555-555-5560',
    contactForAnunualUpdateEmail: 'jane.doe@abccommunityservices.org',
    contactForAnnualUpdateHidden: false,
    services: [],
    volunteerOpportunities: true,
    volunteerOpportunitiesEligibility: '18 years and older',
    volunteerCoordinarorName: 'Volunteer Coordinator',
    volunteerCoordinatorPhoneNumber: '555-555-5561',
    donationRequirements:
      'Non-perishable food items, warm clothing, and hygiene products',
    donationPickup: true,
    donationPickupServiceArea: 'New York City',
    donationCoordinatorName: 'Donation Coordinator',
    donationCoordinatorPhoneNumber: '555-555-5562',
    currentStatus: 'Completed',
    updateScheduleInDays: 365,
  };
  agency.services?.push(savedService);
  try {
    await createAgency(agency);
    return new Response('Success', { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      return new Response(error.message, { status: error.statusCode });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}
