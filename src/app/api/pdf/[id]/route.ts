import { generatePdf } from '@/server/actions/PdfGeneration';
import { JSendResponse } from '@/utils/types';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(
      new JSendResponse({
        status: 'error',
        message: 'Unauthorized',
      }),
      { status: 401 }
    );
  }

  const id = params.id;
  try {
    const pdf = await generatePdf(id);

    // Send the PDF data as a buffer
    return new Response(pdf, {
      headers: { 'content-type': 'application/pdf' },
    });
  } catch (error) {
    console.log(error);
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
