import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets and auth routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/login' ||
    pathname.match(/\.(png|jpg|jpeg|gif|webp)$/)
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('session')?.value;
  const session = await verifyToken(sessionCookie);

  // Protected Admin Routes (UNLOCKED FOR ALL)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Authentication and Role checks have been temporarily disabled to unlock all backends
    // Anyone can access any admin or api route now
  }

  // Next.js request headers injection (optional, maybe helpful for server components)
  const requestHeaders = new Headers(request.headers);
  if (session) {
    requestHeaders.set('x-user-id', session.userId);
    requestHeaders.set('x-user-role', session.role);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
