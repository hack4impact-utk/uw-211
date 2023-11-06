'use client';
import Child from './Child';
import { FormStateHook } from '@/hooks/FormStateHook';

function FormWrapper() {
  // const {formStep, formState, updateFormStep, handleChildCallback} = FormStateHook();
  const { formState, handleChildCallback } = FormStateHook();
  console.log(formState);

  return (
    <div>
      FormWrapper
      {formState.name}
      <Child handleChildCallback={handleChildCallback} />
    </div>
  );
}

export default FormWrapper;
