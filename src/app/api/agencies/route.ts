import {
  getAgencies,
  createService,
  createAgency,
} from '@/server/actions/Agencies';
import '@/server/models/Service';
import { JSendResponse } from '@/utils/types';

export async function GET() {
  try {
    const agencies = await getAgencies();
    const filteredAgencies = agencies.map((agency) => ({
      name: agency.name,
      info: agency.info,
      currentStatus: agency.currentStatus,
      daysSinceEmailSent: agency.daysSinceEmailSent,
    }));
    return Response.json(
      new JSendResponse({
        status: 'success',
        data: { agencies: filteredAgencies },
      }),
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      new JSendResponse({ status: 'error', message: 'Internal Server Error' }),
      { status: 500 }
    );
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
    return Response.json(new JSendResponse({ status: 'success' }), {
      status: 201,
    });
  } catch (error) {
    if (error instanceof JSendResponse) {
      return Response.json(error, { status: 400 });
    }
    return Response.json(
      new JSendResponse({ status: 'error', message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
