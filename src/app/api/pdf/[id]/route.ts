import { generatePdf } from '@/server/actions/PdfGeneration';
import { JSendResponse } from '@/utils/types';
import { authenticateServerEndpoint } from '@/utils/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await authenticateServerEndpoint();
  } catch (error) {
    return Response.json(error, { status: 401 });
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
