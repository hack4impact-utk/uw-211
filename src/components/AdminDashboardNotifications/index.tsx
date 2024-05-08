import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getAgencies } from '@/server/actions/Agencies';
import { Agency } from '@/utils/types';
import { AlertCircle, Check, X } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import PdfButton from '@/components/PdfButton';
import { getLocale, getTranslations } from 'next-intl/server';

export async function AdminDashboardNotifications() {
  const t = await getTranslations('Components.adminDashboardNotifications');
  const locale = await getLocale();

  let agencies: Agency[] = [];

  try {
    agencies = await getAgencies(false, undefined); // TODO: only grab pending agencies
  } catch (error) {
    return <h1>{t('error')}</h1>;
  }

  if (agencies.length <= 0) {
    return <></>;
  }

  return (
    <div className="mx-8">
      <Accordion type="single" collapsible>
        <AccordionItem className="w-full" value="item-1">
          <AccordionTrigger>
            <AlertCircle className="mr-2" />
            <p>{t('notification', { number: agencies.length })}</p>
          </AccordionTrigger>
          <AccordionContent className="mt-6">
            <Table className="rounded-md border text-left shadow">
              <TableHeader>
                <TableRow>
                  <TableHead>{t('tableHeader.name')}</TableHead>
                  <TableHead>{t('tableHeader.date')}</TableHead>
                  <TableHead>{t('tableHeader.pdf')}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agencies.map((agency, index) => (
                  <TableRow
                    key={index}
                    className={index % 2 === 1 ? 'bg-gray-100' : ''}
                  >
                    <TableCell>{agency.name}</TableCell>
                    <TableCell>
                      {agency.updatedAt?.toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <PdfButton agencyId={agency._id?.toString()} />
                    </TableCell>
                    <TableCell>
                      <Button className="mr-4" variant="outline">
                        <Check className="mr-2" />
                        {t('options.approve')}
                      </Button>
                      <Button variant="destructive">
                        <X className="mr-2" />
                        {t('options.deny')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
