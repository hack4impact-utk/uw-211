import { generatePdf } from '@/server/actions/PdfGeneration';
import { JSendResponse } from '@/utils/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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
