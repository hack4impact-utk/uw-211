'use client';
import { state } from '@/hooks/FormStateHook';
import { useForm } from 'react-hook-form';

interface ChildProps {
  handleChildCallback: (data: state) => void;
}

function Child(props: ChildProps) {
  const { register, handleSubmit } = useForm();

  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => {
          const d: state = {
            name: data.name,
          };
          props.handleChildCallback(d);
        })}
      >
        <input type="text" {...register('name')} placeholder="Enter Name" />
        <br></br>
        <br></br>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Child;
