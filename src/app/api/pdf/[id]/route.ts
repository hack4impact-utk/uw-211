import { generatePdf } from '@/server/actions/PdfGeneration';
import { JSendResponse } from '@/utils/types';
import fs from 'fs';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const pdf = await generatePdf(id);

    fs.writeFileSync('./public/211_form_filled.pdf', pdf);
  } catch (error) {
    console.error(error);
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
