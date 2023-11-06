'use client';
import { state } from '@/hooks/FormStateHook';

interface ChildProps {
  handleChildCallback: (data: state) => void;
}

function Child(props: ChildProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      name: HTMLInputElement;
    };

    const data = {
      name: formElements.name.value,
    };

    props.handleChildCallback(data);
    console.log('test');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Enter Name" />
        <br></br>
        <br></br>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Child;
