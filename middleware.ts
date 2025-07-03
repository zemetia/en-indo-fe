import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  locales: ['id', 'en'],
  defaultLocale: 'id',
  localePrefix: 'always'
});
 
export const config = {
  // Skip all paths that should not be internationalized.
  matcher: ['/((?!api|_next|.*\\..*|dashboard|login).*)']
};