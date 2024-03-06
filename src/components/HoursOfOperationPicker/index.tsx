import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import {
  HoursOfOperationDataSchema,
  HoursOfOperationOfADaySchema,
} from '@/utils/constants/formDataSchema';
import { UseControllerProps, useController } from 'react-hook-form';

type Hours = z.infer<typeof HoursOfOperationOfADaySchema>;
type HoursOfOperation = z.infer<typeof HoursOfOperationDataSchema>;

export default function HoursOfOperationPicker({
  name,
  control,
}: UseControllerProps<HoursOfOperation>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  // @ts-expect-error field.value has weird union type..., but it works
  const [hours, setHours] = useState<HoursOfOperation>(field.value || []);

  const [day, setDay] = useState<number>(0);
  const [open, setOpen] = useState<number>(18); // Default 9:00 AM
  const [close, setClose] = useState<number>(34); // Default 5:00 PM

  useEffect(() => {
    // @ts-expect-error field.value has weird union type..., but it works
    setHours(field.value || []);
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
        <Select onValueChange={(v) => setDay(+v)}>
          <SelectTrigger>
            <SelectValue placeholder="Day">{daysOfWeek[day]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {daysOfWeek.map((dayOfWeek, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {dayOfWeek}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select onValueChange={(v) => setOpen(+v)}>
          <SelectTrigger>
            <SelectValue placeholder="Open">{times[open]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {times.map((time, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {time}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select onValueChange={(v) => setClose(+v)}>
          <SelectTrigger>
            <SelectValue placeholder="Close">{times[close]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {times.map((time, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {time}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
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
