import { getAgencyById } from '@/server/actions/Agencies';
import { JSendResponse } from '@/utils/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const agency = await getAgencyById(id);

    return Response.json(
      new JSendResponse({
        status: 'success',
        data: { agency: agency },
      }),
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof JSendResponse) {
      return Response.json(error, { status: 400 });
    }
    return Response.json(
      new JSendResponse({
        status: 'error',
        message: 'Internal Server Error',
      }),
      { status: 500 }
    );
  }
}
