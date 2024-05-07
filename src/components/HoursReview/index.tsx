import { DaySchema } from '@/utils/constants/formDataSchema';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

type Hours = z.infer<typeof DaySchema>;
interface HoursReviewProps {
  hours: Hours[];
}

export function HoursReview({ hours }: HoursReviewProps) {
  const t = useTranslations('Components.hours');

  const getDayOfWeek = (d: string) => {
    const daysMap = new Map([
      ['Monday', t('days.monday')],
      ['Tuesday', t('days.tuesday')],
      ['Wednesday', t('days.wednesday')],
      ['Thursday', t('days.thursday')],
      ['Friday', t('days.friday')],
      ['Saturday', t('days.saturday')],
      ['Sunday', t('days.sunday')],
    ]);

    return daysMap.get(d);
  };

  return (
    <div>
      {hours.map((h, index) => (
        <div key={index} className="grid grid-cols-3">
          <p className="text-base font-medium leading-7 text-gray-900">
            {getDayOfWeek(h.day)}
          </p>
          <p>{h.openTime}</p>
          <p>{h.closeTime}</p>
        </div>
      ))}
    </div>
  );
}
