import ClientSessionProvider from '@/components/ClientSessionProvider';
import './globals.css';

export const metadata = {
  title: 'United Way 211',
  description:
    "An overhaul of United Way Greater Knoxville's 211 system. \
  This service offers information and referral services to health, human, and social service non-profits",
  icons: {
    icon: ['/favicon.ico'],
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale}>
      <body className="w-screen overflow-x-hidden">
        <ClientSessionProvider>{children}</ClientSessionProvider>
      </body>
    </html>
  );
}
