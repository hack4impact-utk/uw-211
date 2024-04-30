import { z } from 'zod';
import {
  // FormDataSchema,
  additionalNumbersSchema,
} from '@/utils/constants/formDataSchema';
// import { UseControllerProps, useController } from 'react-hook-form';
import { Button } from '../ui/button';
import { useState } from 'react';

type AdditionalNumbers = z.infer<typeof additionalNumbersSchema>;

export default function AdditionalNumbers() {
  const [numbers, setNumbers] = useState<AdditionalNumbers[]>([]); // update to use controller
  const [hover, setHover] = useState<boolean>(false);
  const label = document.getElementById('label') as HTMLInputElement;
  const number = document.getElementById('number') as HTMLInputElement;

  const addNumber = () => {
    if (label?.value != '' && number?.value != '') {
      const new_number = {
        id: Date.now(),
        label: label?.value,
        number: number?.value,
      };

      setNumbers((prevState) => [...prevState, new_number]);
      label.value = '';
      number.value = '';
    }
  };

  const deleteNumber = (id: number) => {
    const updatedNumbers = numbers.filter((n) => n.id !== id);
    setNumbers(updatedNumbers);
    // field.onChange(updatedNumbers);  // controller
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
    </div>
  );
}
