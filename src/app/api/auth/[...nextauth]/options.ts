import { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID as string,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
      tenantId: process.env.AZURE_AD_TENENT_ID as string,
    }),
  ],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async signIn(verificationRequest) {
      const userEmail = verificationRequest.user.email;
      const allowedDomains =
        process.env.NODE_ENV === 'production'
          ? ['@unitedwayknox.org', '@knoxvilletn.gov']
          : [
              '@gmail.com',
              '@yahoo.com',
              '@hotmail.com',
              '@outlook.com',
              '@vols.utk.edu',
            ];

      for (const domain of allowedDomains) {
        if (userEmail?.endsWith(domain)) {
          return true;
        }
      }

      return false;
    },
  },
};
