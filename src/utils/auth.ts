import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { JSendResponse } from './types';

export async function authenticateServerAction() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new JSendResponse({
      status: 'error',
      message: 'Unauthorized',
      code: 401,
    });
  }
}

export async function authenticateServerEndpoint() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new JSendResponse({
      status: 'error',
      message: 'Unauthorized',
    });
  }
}
