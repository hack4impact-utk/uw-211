export default function Form({ params }: { params: { id: string } }) {
  return <div>Welcome screen for nonprofit {params.id}</div>;
}
