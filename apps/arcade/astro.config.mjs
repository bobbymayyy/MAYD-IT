import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://play.mayyy.us',
  output: 'static',
  trailingSlash: 'never',
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "base-uri 'none'",
        "form-action 'none'",
        "object-src 'none'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'none'",
        "manifest-src 'self'",
        "media-src 'none'",
        "worker-src 'self'",
        "upgrade-insecure-requests",
      ],
    },
  },
});
