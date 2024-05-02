import { DaySchema } from '@/utils/constants/formDataSchema';
import { z } from 'zod';

type Hours = z.infer<typeof DaySchema>;
interface HoursReviewProps {
  hours: Hours[];
}

export function HoursReview({ hours }: HoursReviewProps) {
  return (
    <div>
      {hours.map((h, index) => (
        <div key={index} className="grid grid-cols-3">
          <p className="text-base font-medium leading-7 text-gray-900">
            {h.day}
          </p>
          <p>{h.openTime}</p>
          <p>{h.closeTime}</p>
        </div>
      ))}
    </div>
  );
}
