import { useState } from 'react';

export interface state {
  name: string;
}

export const FormStateHook = () => {
  //   const [formStep, setFormStep] = useState<number>(0);
  const [formState, setFormState] = useState<state>({
    name: '',
  });

  //   const updateFormStep = (data: number): void => {
  //     setFormStep(data);
  //   };

  const handleChildCallback = (childData: state): void => {
    setFormState(childData);
  };

  //   return { formState, formStep, updateFormStep, handleChildCallback };
  return { formState, handleChildCallback };
};
