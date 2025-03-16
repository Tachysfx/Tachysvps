import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware adds X-Robots-Tag headers to control search engine indexing
export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const pathname = request.nextUrl.pathname;
  
  // Create a response object from the incoming request
  const response = NextResponse.next();
  
  // Add X-Robots-Tag header to control indexing for specific pages
  if (pathname.startsWith('/v6/')) {
    // Prevent indexing of these pages
    response.headers.set('X-Robots-Tag', 'noindex, follow');
  } else if (pathname === '/' || 
    pathname === '/about' || 
    pathname === '/contact-us' || 
    pathname === '/explore' || 
    pathname === '/market' || 
    pathname === '/partnership' || 
    pathname === '/plans' || 
    pathname === '/sign_in' ||
    pathname.startsWith('/market/')) { // Allow indexing of all market pages including algorithm details
    // Encourage indexing of the homepage and important pages
    response.headers.set('X-Robots-Tag', 'index, follow');
  } else{
    // These pages should be indexed but with lower priority
    response.headers.set('X-Robots-Tag', 'index, follow');
  }
  
  return response;
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Match all routes
    '/(.*)',
    // Exclude static files, api routes, and _next
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}; 