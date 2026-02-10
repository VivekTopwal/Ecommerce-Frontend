import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;


  const isAdminRoute = path.startsWith('/admin') && !path.startsWith('/admin/login');
  const isAuthRoute = path === '/login' || path === '/register';
  const isProtectedRoute = path === '/cart' || path === '/wishlist' || path === '/checkout' || path.startsWith('/order-confirmation');

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

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