import {
  getAgencies,
  createService,
  createAgency,
} from '@/server/actions/Agencies';
import '@/server/models/Service';
import { ApiError } from '@/utils/types';

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
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { services, ...agency } = body;

    const serviceIds = [];
    for (const service of services) {
      const createdService = await createService(service);
      serviceIds.push(createdService._id);
    }

    await createAgency({ ...agency, services: serviceIds });
    return new Response('Success', { status: 200 });
  } catch (error) {
    if (error instanceof ApiError) {
      return new Response(error.message, { status: error.statusCode });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}
