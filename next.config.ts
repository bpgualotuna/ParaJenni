import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Photos are resized by the authorized API. Disable Next's shared public
  // optimizer route so it cannot retain a private photo across date previews.
  images: { unoptimized: true },
  outputFileTracingIncludes: { '/api/photos/*': ['./private-media/**/*'] },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'same-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Cache-Control', value: 'private, no-store, max-age=0, must-revalidate' },
    ] }];
  },
};

export default nextConfig;
