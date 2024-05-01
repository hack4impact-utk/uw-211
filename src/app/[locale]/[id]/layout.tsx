import Header from '@/components/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Header className="fixed" />
      {children}
    </main>
  );
}
