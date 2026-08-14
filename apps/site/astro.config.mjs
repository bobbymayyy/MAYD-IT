import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mayyy.us',
  output: 'static',
  trailingSlash: 'never',
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "manifest-src 'self'",
        "media-src 'self'",
        "worker-src 'self'",
        "upgrade-insecure-requests",
      ],
    },
  },
});
