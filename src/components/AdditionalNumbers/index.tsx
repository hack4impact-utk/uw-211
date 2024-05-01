import { z } from 'zod';
import {
  FormDataSchema,
  additionalNumbersSchema,
} from '@/utils/constants/formDataSchema';
import { UseControllerProps, useController } from 'react-hook-form';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';

type AdditionalNumbers = z.infer<typeof additionalNumbersSchema>;
type FormData = z.infer<typeof FormDataSchema>;

export default function AdditionalNumbers({
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

  const [numbers, setNumbers] = useState(
    (field.value as AdditionalNumbers[]) || []
  );

  const [hover, setHover] = useState<boolean>(false);
  const label = document.getElementById('label') as HTMLInputElement;
  const number = document.getElementById('number') as HTMLInputElement;

  useEffect(() => {
    setNumbers((field.value as AdditionalNumbers[]) || []);
  }, [field.value]);

  const addNumber = () => {
    const new_number = {
      id: Date.now(),
      label: label?.value,
      number: number?.value,
    };

    // check for both fields
    if (label?.value === '' || number?.value === '') {
      control?.setError(name, {
        type: 'custom',
        message: 'Must have a label and number for each additional number.',
      });
      return;
    }

    // stop duplicate entries
    if (
      numbers.find(
        (a) => a.label == new_number.label || a.number == new_number.number
      )
    ) {
      control?.setError(name, {
        type: 'custom',
        message: 'Cannot add duplicate labels or numbers.',
      });
      return;
    }

    // Invalid number
    if (new_number.number.length != 10 || !/^\d+$/.test(new_number.number)) {
      control?.setError(name, {
        type: 'custom',
        message: 'Please enter valid phone number.',
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

    const newState = numbers.concat(new_number);
    // setNumbers((prevState) => [...prevState, new_number]);
    setNumbers(newState);

    field.onChange(newState);

    label.value = '';
    number.value = '';
  };

  const deleteNumber = (id: number) => {
    const updatedNumbers = numbers.filter((n) => n.id !== id);
    setNumbers(updatedNumbers);
    field.onChange(updatedNumbers);
  };

  return (
    <div className="mb-4">
      <h3 className="block text-sm font-medium leading-6 text-gray-900">
        Additional Numbers
      </h3>

      <div className="mt-2 flex flex-row gap-2">
        <input
          type="text"
          id="label"
          placeholder="Label"
          className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:w-1/6 sm:text-sm sm:leading-6"
        />
        <input
          type="text"
          id="number"
          placeholder="Number"
          className="h-8 w-full rounded-sm border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-sky-600 sm:w-4/6 sm:text-sm sm:leading-6"
        />
        <Button type="button" className="h-8" onClick={addNumber}>
          Add Number
        </Button>
      </div>

      <div
        className={`max-h-28 overflow-y-auto ${hover && numbers.length >= 4 && 'bg-gradient-to-t from-gray-100 to-transparent bg-[length:100%_20%] bg-bottom bg-no-repeat'}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="flex flex-col p-2">
          {numbers.map((n, index) => (
            <div key={index} className="flex flex-row items-center">
              <p className="w-1/6 font-medium">{n.label}</p>
              <p className="grow">{n.number}</p>
              <Button
                type="button"
                variant="link"
                className="h-7"
                onClick={() => deleteNumber(n.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      {error?.message && (
        <p className="mt-2 text-sm text-red-400">{error?.message}</p>
      )}
    </div>
  );
}
