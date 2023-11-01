import { getAgencies } from '@/server/actions/Agencies';
import '@/server/models/Service';

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
