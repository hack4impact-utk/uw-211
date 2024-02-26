import { useState } from 'react';
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

export default function HoursOfOperationPicker() {
  interface Hours {
    dayOfWeek: string;
    start: string;
    end: string;
  }

  const [hours, setHours] = useState<Hours[]>([]);
  const [day, setDay] = useState<number>(1);
  const [open, setOpen] = useState<number>(-1);
  const [close, setClose] = useState<number>(-1);

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      // Generate the string for each half-hour mark
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return times;
  };

  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const handleSubmit = () => {
    const x: Hours = {
      dayOfWeek: daysOfWeek[day],
      start: generateTimeOptions()[open],
      end: generateTimeOptions()[close],
    };

    const updatedHours = [...hours, x];
    setHours(updatedHours);
  };

  return (
    <div>
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
              {generateTimeOptions().map((time, index) => (
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
              {generateTimeOptions().map((time, index) => (
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
        <Button onClick={handleSubmit}>Add Hours</Button>
      </div>
      <Separator className="m-2" />
      <div className="flex flex-col">
        {hours.map((h, index) => (
          <div key={index} className="flex flex-row space-x-2">
            <p>{h.dayOfWeek}</p>
            <p>{h.start}</p>
            <p>{h.end}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
