import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { FormDataSchema, DaySchema } from '@/utils/constants/formDataSchema';
import { UseControllerProps, useController } from 'react-hook-form';
import { ScrollArea } from '../ui/scroll-area';

type Hours = z.infer<typeof DaySchema>;
type FormData = z.infer<typeof FormDataSchema>;
type Day =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export default function Hours({ name, control }: UseControllerProps<FormData>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const [hours, setHours] = useState((field.value as Hours[]) || []);

  const [day, setDay] = useState<Day>('Monday');
  const [open, setOpen] = useState<string>('9:00 AM');
  const [close, setClose] = useState<string>('5:00 PM');

  const [hover, setHover] = useState<boolean>(false);

  useEffect(() => {
    setHours((field.value as Hours[]) || []);
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

  const daysOfWeek: Day[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const mapTimeToMinutes = (time: string) => {
    const [hourPart, period] = time.split(' ');
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = hourPart.split(':').map(Number);

    if (hours === 12) hours = 0; // Convert 12:00 to 0 for sorting purposes
    if (period === 'PM') hours += 12;

    return hours * 60 + minutes;
  };

  const sortHours = (hours: Hours[]) => {
    return hours.sort((a, b) => {
      // Compare days first
      const dayComparison =
        daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
      if (dayComparison !== 0) return dayComparison;

      // Compare open times next
      const openTimeA = mapTimeToMinutes(a.openTime);
      const openTimeB = mapTimeToMinutes(b.openTime);
      const openComparison = openTimeA - openTimeB;
      if (openComparison !== 0) return openComparison;

      // If open times are the same, compare close times
      const closeTimeA = mapTimeToMinutes(a.closeTime);
      const closeTimeB = mapTimeToMinutes(b.closeTime);
      return closeTimeA - closeTimeB;
    });
  };

  // Handler Functions
  const add_hours = () => {
    const new_hours: Hours = {
      id: Date.now(),
      day: day,
      openTime: open,
      closeTime: close,
    };

    // Duplicate entries
    if (
      hours.find(
        (a) =>
          a.day == new_hours.day &&
          a.openTime == new_hours.openTime &&
          a.closeTime == new_hours.closeTime
      )
    ) {
      control?.setError(name, {
        type: 'custom',
        message: 'Cannot add duplicate hours.',
      });
      return;
    }

    const openIndex = times.indexOf(new_hours.openTime);
    const closeIndex = times.indexOf(new_hours.closeTime);
    const isFullDay =
      new_hours.openTime === '12:00 AM' && new_hours.closeTime === '12:00 AM';

    // Invalid times ranges
    if (openIndex >= closeIndex && !isFullDay) {
      control?.setError(name, {
        type: 'custom',
        message: 'Invalid time range.',
      });
      return;
    }

    // Reset errors
    if (error?.type == 'custom') {
      control?.setError(name, {
        type: 'clear',
        message: '',
      });
    }

    const updatedHours = sortHours([...hours, new_hours]);
    setHours(updatedHours);

    field.onChange(updatedHours);

    // set day to next day
    const currentIndex = daysOfWeek.indexOf(day);
    const nextIndex = currentIndex + 1;
    if (nextIndex < daysOfWeek.length) {
      setDay(daysOfWeek[nextIndex]);
    }
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
          onChange={(e) => setDay(e.target.value as Day)}
          value={day}
          className="block h-10 w-full rounded-md border-0 bg-inherit p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 md:w-2/3 xl:w-full"
        >
          {daysOfWeek.map((dayOfWeek, index) => (
            <option value={dayOfWeek} key={index}>
              {dayOfWeek}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setOpen(e.target.value)}
          value={open}
          className="block h-10 w-full rounded-md border-0 bg-inherit p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 md:w-2/3 xl:w-full"
        >
          {times.map((time, index) => (
            <option value={time} key={index}>
              {time}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setClose(e.target.value)}
          value={close}
          className="block h-10 w-full rounded-md border-0 bg-inherit p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 md:w-2/3 xl:w-full"
        >
          {times.map((time, index) => (
            <option value={time} key={index}>
              {time}
            </option>
          ))}
        </select>
        <Button type="button" onClick={add_hours}>
          Add Hours
        </Button>
      </div>
      <Separator className="my-2" />
      <ScrollArea
        className="relative h-40"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="flex flex-col">
          {hours.map((h, index) => (
            <div key={index} className="grid grid-cols-4">
              <p>{h.day}</p>
              <p>{h.openTime}</p>
              <p>{h.closeTime}</p>
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
        {/* Scrollarea is hard to see, shadow appears when there are 4 or more times. */}
        {hover && hours.length >= 4 ? (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-gray-100 to-transparent" />
        ) : (
          <></>
        )}
      </ScrollArea>
      {error?.message && (
        <p className="mt-2 text-sm text-red-400">{error?.message}</p>
      )}
    </>
  );
}
