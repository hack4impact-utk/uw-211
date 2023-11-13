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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientSessionProvider>{children}</ClientSessionProvider>
      </body>
    </html>
  );
}
