'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Newspaper } from 'lucide-react';
import { generatePdf } from '@/server/actions/PdfGeneration';

interface PdfButtonProps {
  agencyId: string | undefined;
}

const PdfButton: React.FC<PdfButtonProps> = ({ agencyId }) => {
  const downloadPdf = async (id: string | undefined) => {
    if (id === undefined) {
      return;
    }

    const pdfBytes = await generatePdf(id);

    const blob = new Blob([pdfBytes], {
      type: 'application/pdf;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <Button variant="outline" onClick={() => downloadPdf(agencyId)}>
      <Newspaper className="mr-2" />
      View form
    </Button>
  );
};

export default PdfButton;
