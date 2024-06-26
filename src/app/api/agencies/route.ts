import {
  getAgencies,
  createService,
  createAgency,
  createAgencyInfo,
} from '@/server/actions/Agencies';
import '@/server/models/Service';
import { AgencyInfoForm, JSendResponse } from '@/utils/types';
import { authenticateServerEndpoint } from '@/utils/auth';

export async function GET() {
  try {
    await authenticateServerEndpoint();
  } catch (error) {
    return Response.json(error, { status: 401 });
  }

  try {
    const agencies = await getAgencies();
    const filteredAgencies = agencies.map((agency) => ({
      _id: agency._id,
      createdAt: agency.createdAt,
      updatedAt: agency.updatedAt,
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
    if (error instanceof JSendResponse) {
      return Response.json(error, { status: 400 });
    }
    return Response.json(
      new JSendResponse({ status: 'error', message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await authenticateServerEndpoint();
  } catch (error) {
    return Response.json(error, { status: 401 });
  }

  try {
    const body = await request.json();
    const { info, ...agencyWithoutInfo } = body;
    const { services, ...infoWithoutServices } = info;

    const serviceIds = [];
    for (const service of services) {
      const newService = await createService(service);
      serviceIds.push(newService._id);
    }
    const updatedInfo = {
      ...infoWithoutServices,
      services: serviceIds,
    } as AgencyInfoForm;

    const agencyInfo = await createAgencyInfo(updatedInfo);

    const agency = { ...agencyWithoutInfo, info: agencyInfo._id };

    await createAgency(agency);
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
