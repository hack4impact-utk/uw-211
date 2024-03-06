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

export default function HoursOfOperationPicker(
  props: UseControllerProps<HoursOfOperation>
) {
  const { field, fieldState } = useController(props);

  // @ts-expect-error field.value has weird union type..., but it works
  const [hours, setHours] = useState<HoursOfOperation>(field.value || []);

  useEffect(() => {
    // Ensure that field.value is an array and each item matches the expected structure
    if (
      Array.isArray(field.value) &&
      field.value.every(
        (item) =>
          typeof item === 'object' &&
          'id' in item &&
          'day' in item &&
          'start' in item &&
          'end' in item
      )
    ) {
      setHours(field.value);
    } else {
      setHours([]);
    }
  }, [field.value]);

  const [day, setDay] = useState<number>(1);
  const [open, setOpen] = useState<number>(-1);
  const [close, setClose] = useState<number>(-1);

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
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // Handler Functions
  const add_hours = () => {
    const x: Hours = {
      id: Date.now(),
      day: day,
      start: open,
      end: close,
    };

    const updatedHours = [...hours, x];
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
            <SelectValue placeholder="Day" />
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
            <SelectValue placeholder="Open" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {times.map((time, index) => (
                <SelectItem
                  key={index}
                  value={index.toString()}
                  disabled={close != -1 && index >= close}
                >
                  {time}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select onValueChange={(v) => setClose(+v)}>
          <SelectTrigger>
            <SelectValue placeholder="Close" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {times.map((time, index) => (
                <SelectItem
                  key={index}
                  value={index.toString()}
                  disabled={open != -1 && index <= open}
                >
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
              className="mb-1"
              variant="link"
              onClick={() => delete_hours(h.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      {fieldState?.error?.message && (
        <p className="mt-2 text-sm text-red-400">
          {fieldState?.error?.message}
        </p>
      )}
    </>
  );
}
