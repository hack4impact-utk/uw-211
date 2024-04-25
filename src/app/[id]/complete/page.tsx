import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default async function Complete() {
  return (
    <main>
      <Header />
      <p>form completed</p>
      <Footer className="fixed bottom-3 py-2" />
    </main>
  );
}
