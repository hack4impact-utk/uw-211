'use client';
import { state } from '@/hooks/FormStateHook';

interface HandleChildCallback {
  handleChildCallback: (data: state) => void;
}

function Child(Props: HandleChildCallback) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      name: HTMLInputElement;
    };

    const data = {
      name: formElements.name.value,
    };

    Props.handleChildCallback(data);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Enter Name" />
        <br></br>
        <br></br>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Child;
