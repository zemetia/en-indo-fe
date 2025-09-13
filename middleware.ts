import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // This middleware is a no-op and can be removed if not needed.
  return NextResponse.next();
}

export const config = {
  // This matcher ensures the middleware does not run on any path.
  matcher: [],
};
