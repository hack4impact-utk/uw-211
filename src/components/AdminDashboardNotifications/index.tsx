'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Agency } from '@/utils/types';
import { AlertCircle, Check, X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import PdfButton from '@/components/PdfButton';
import { approveAgency } from '@/server/actions/Agencies';
import { toast } from 'sonner';
import { useTranslations, useLocale } from 'next-intl';

type AdminDashboardNotificationsProps = {
  agencies: Agency[];
};

export function AdminDashboardNotifications({
  agencies,
}: AdminDashboardNotificationsProps) {
  const t = useTranslations('Components.adminDashboardNotifications');
  const locale = useLocale();

  // deserialize JSON date string as Date object
  for (const agency of agencies) {
    agency.updatedAt = new Date(agency.updatedAt as unknown as string);
    agency.createdAt = new Date(agency.createdAt as unknown as string);
  }

  const agenciesPendingApproval = agencies.filter(
    (agency) => agency.approvalStatus === 'Pending'
  );
  console.log('agenciesPendingApproval', agenciesPendingApproval);

  if (agencies.length <= 0) {
    return <></>;
  }

  const handleApprove = async (agency: Agency) => {
    if (!agency._id || !agency.latestInfo) {
      return;
    }

    try {
      await approveAgency(agency._id, agency.latestInfo, 'Approved');
    } catch (error) {
      toast.error(t('error'));
    }
  };

  const handleReject = (agency: Agency) => {
    console.log('handleReject', agency);
  };

  return (
    <div className="mx-8">
      <Accordion type="single" collapsible>
        <AccordionItem className="w-full" value="item-1">
          <AccordionTrigger>
            <AlertCircle className="mr-2" />
            <p>{t('notification', { number: agencies.length })}</p>
          </AccordionTrigger>
          <AccordionContent className="mt-6">
            <Table className="mt-2 rounded-md border text-left shadow">
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
                      <Button
                        className="mr-4"
                        variant="outline"
                        onClick={() => handleApprove(agency)}
                      >
                        <Check className="mr-2" />
                        {t('options.approve')}
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={() => handleReject(agency)}
                      >
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
