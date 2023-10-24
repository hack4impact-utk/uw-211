import dbConnect from '@/utils/db-connect';
import Agency from '@/server/models/Agency';
import '@/server/models/Service';

export async function GET() {
  await dbConnect();
  try {
    const agencies = await Agency.find({})
      .select('legalAgencyName contactEmail currentStatus')
      .exec();
    return Response.json({ agencies });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Server Error' });
  }
}
