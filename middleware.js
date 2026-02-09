import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // Define protected routes
  const isAdminRoute = path.startsWith('/admin') && !path.startsWith('/admin/login');
  const isAuthRoute = path === '/login' || path === '/register';
  const isProtectedRoute = path === '/cart' || path === '/wishlist' || path === '/checkout' || path.startsWith('/order-confirmation');

  // Redirect to login if accessing protected routes without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to admin login if accessing admin routes without token
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If logged in and trying to access auth pages, redirect appropriately
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (path === '/admin/login' && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/cart',
    '/wishlist',
    '/checkout',
    '/order-confirmation/:path*',
    '/login',
    '/register',
  ],
};