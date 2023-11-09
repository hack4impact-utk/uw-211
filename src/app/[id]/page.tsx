// import FormWrapper from '@/components/FormWrapper/FormWrapper';
import WelcomePage from '@/components/WelcomePage/Index';

export default function Form({ params }: { params: { id: string } }) {
  return (
    <>
      <div>
        <WelcomePage id={params.id} />
        {/* <FormWrapper /> */}
      </div>
    </>
  );
}
