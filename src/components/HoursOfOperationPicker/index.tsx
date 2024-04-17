import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import {
  FormDataSchema,
  HoursOfOperationDataSchema,
  HoursOfOperationOfADaySchema,
} from '@/utils/constants/formDataSchema';
import { UseControllerProps, useController } from 'react-hook-form';

type Hours = z.infer<typeof HoursOfOperationOfADaySchema>;
type HoursOfOperation = z.infer<typeof HoursOfOperationDataSchema>;
type FormData = z.infer<typeof FormDataSchema>;

export default function HoursOfOperationPicker({
  name,
  control,
}: UseControllerProps<FormData>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const [hours, setHours] = useState((field.value as HoursOfOperation) || []);

  const [day, setDay] = useState<number>(0);
  const [open, setOpen] = useState<number>(18); // Default 9:00 AM
  const [close, setClose] = useState<number>(34); // Default 5:00 PM

  useEffect(() => {
    setHours((field.value as HoursOfOperation) || []);
  }, [field.value]);

  const times = (() => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      const hour12 = hour % 12 === 0 ? 12 : hour % 12;
      const amPm = hour < 12 ? 'AM' : 'PM';

      times.push(`${hour12.toString()}:00 ${amPm}`);
      times.push(`${hour12.toString()}:30 ${amPm}`);
    }
    times.push(`12:00 AM`);
    return times;
  })();

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // Handler Functions
  const add_hours = () => {
    const new_hours: Hours = {
      id: Date.now(),
      day: day,
      start: open,
      end: close,
    };

    // Duplicate entries
    if (
      hours.find(
        (a) =>
          a.day == new_hours.day &&
          a.start == new_hours.start &&
          a.end == new_hours.end
      )
    ) {
      control?.setError(name, {
        type: 'custom',
        message: 'Cannot add duplicate hours.',
      });
      return;
    }
    // Invalid times ranges
    else if (new_hours.start >= new_hours.end) {
      control?.setError(name, {
        type: 'custom',
        message: 'Invalid time range.',
      });
      return;
    }
    // Reset errors
    else if (error?.type == 'custom') {
      control?.setError(name, {
        type: 'clear',
        message: '',
      });
    }

    const updatedHours = [...hours, new_hours].sort((a, b) => a.day - b.day);
    setHours(updatedHours);

    field.onChange(updatedHours);
  };

  const delete_hours = (id: number) => {
    const updatedHours = hours.filter((h) => h.id !== id);
    setHours(updatedHours);
    field.onChange(updatedHours);
  };

  return (
    <>
      <div className="flex flex-row space-x-2">
        <select
          onChange={(e) => setDay(+e.target.value)}
          className="block h-10 w-full rounded-md border-0 bg-inherit p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 md:w-2/3 xl:w-full"
        >
          {daysOfWeek.map((dayOfWeek, index) => (
            <option value={index} key={index}>
              {dayOfWeek}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setOpen(+e.target.value)}
          className="block h-10 w-full rounded-md border-0 bg-inherit p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 md:w-2/3 xl:w-full"
        >
          {times.map((time, index) => (
            <option value={index} key={index}>
              {time}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setClose(+e.target.value)}
          className="block h-10 w-full rounded-md border-0 bg-inherit p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 md:w-2/3 xl:w-full"
        >
          {times.map((time, index) => (
            <option value={index} key={index}>
              {time}
            </option>
          ))}
        </select>
        <Button type="button" onClick={add_hours}>
          Add Hours
        </Button>
      </div>
      <Separator className="m-2" />
      <div className="flex flex-col">
        {hours.map((h, index) => (
          <div key={index} className="grid grid-cols-4">
            <p>{daysOfWeek[h.day]}</p>
            <p>{times[h.start]}</p>
            <p>{times[h.end]}</p>
            <Button
              type="button"
              className="mb-1"
              variant="link"
              onClick={() => delete_hours(h.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      {error?.message && (
        <p className="mt-2 text-sm text-red-400">{error?.message}</p>
      )}
    </>
  );
}
