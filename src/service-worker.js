/* eslint-disable no-restricted-globals */
// Built by react-scripts (Workbox InjectManifest) during `npm run build`. Not used by `npm start`.
import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

// A new version takes over as soon as it has downloaded, so the next open or refresh shows it. No banner, no waiting.
// Safe here because the app is one JS file and one CSS file, both already loaded by any open page, so removing the old
// files can't break a page that's still open. If the build ever gets split into lazy-loaded chunks, revisit this.
self.addEventListener("install", () => self.skipWaiting());
clientsClaim();

// The app's JS, CSS and index.html. The list is injected at build time.
precacheAndRoute(self.__WB_MANIFEST);

// Any page URL (/, /bar, /edit/123) loads the cached index.html, so the app opens offline.
const fileExtension = /\/[^/?]+\.[^/]+$/;
registerRoute(
  ({ request, url }) => request.mode === "navigate" && !url.pathname.startsWith("/_") && !fileExtension.test(url.pathname),
  createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html")
);

// Images from /public (logo, icons).
registerRoute(
  ({ url }) => url.origin === self.location.origin && /\.(png|jpe?g|svg|ico|webp)$/.test(url.pathname),
  new CacheFirst({
    cacheName: "images",
    plugins: [new ExpirationPlugin({ maxEntries: 50 })],
  })
);

// Google Fonts: the stylesheet can change, the font files never do.
registerRoute(
  ({ url }) => url.origin === "https://fonts.googleapis.com",
  new StaleWhileRevalidate({ cacheName: "google-fonts-stylesheets" })
);
registerRoute(
  ({ url }) => url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }),
    ],
  })
);
