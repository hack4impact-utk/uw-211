import dbConnect from '@/utils/db-connect';
import Person from '@/server/models/Person';

// This function should definitely be in app/api instead of part of a page
async function createPerson() {
  await dbConnect();

  const person = new Person({
    name: 'Cool Guy',
    nickname: 'asdf',
    email: 'coolguy@email.com',
  });

  await person.save();
}

export default function TestDatabase() {
  createPerson();

  return (
    <div>
      <h1>Should have created a new person in the people collection!</h1>
    </div>
  );
}
