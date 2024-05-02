'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Newspaper } from 'lucide-react';
import { useState } from 'react';
import Spinner from '@/components/Spinner';

interface PdfButtonProps {
  agencyId: string | undefined;
}

const PdfButton: React.FC<PdfButtonProps> = ({ agencyId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const downloadPdf = async (id: string | undefined) => {
    if (id === undefined) {
      return;
    }

    setIsLoading(true);
    const pdfBytes = await fetch(`/api/pdf/${id}`).then((res) =>
      res.arrayBuffer()
    );

    const blob = new Blob([pdfBytes], {
      type: 'application/pdf;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    setIsLoading(false);
    window.open(url);
  };

  return (
    <Button
      variant="outline"
      className="h-10 w-36"
      onClick={() => downloadPdf(agencyId)}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div className="flex">
          <Newspaper className="mr-2" />
          View form
        </div>
      )}
    </Button>
  );
};

export default PdfButton;
