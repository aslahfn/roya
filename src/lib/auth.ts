import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET || 'super-secret-key-for-development-only';
const encodedKey = new TextEncoder().encode(secretKey);

export type Role =
  | 'SUPER_ADMIN'
  | 'PRICING_MANAGER'
  | 'STORE_MANAGER'
  | 'INVENTORY_MANAGER'
  | 'ORDER_MANAGER'
  | 'DELIVERY_MANAGER'
  | 'CUSTOMER_SUPPORT'
  | 'CUSTOMER';

export interface SessionPayload {
  userId: string;
  role: Role;
  branchId: string | null;
  name: string;
  expiresAt: Date;
}

export async function signToken(payload: SessionPayload) {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function verifyToken(session: string | undefined = '') {
  try {
    if (!session) return null;
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function createSession(payload: Omit<SessionPayload, 'expiresAt'>) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await signToken({ ...payload, expiresAt });
  
  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

// UNLOCKED BACKENDS: Default session provides full SUPER_ADMIN access to all backend routes
export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  
  if (sessionCookie) {
    const verified = await verifyToken(sessionCookie);
    if (verified) return verified;
  }
  
  return {
    userId: 'super-admin-root-id',
    role: 'SUPER_ADMIN' as Role,
    branchId: null,
    name: 'Super Admin (Unlocked)',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  };
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
