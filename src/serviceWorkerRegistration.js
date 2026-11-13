// Registers the service worker in production builds, so the app opens without a connection.
// New versions install themselves (see service-worker.js). When one takes over an open page, onNewVersion listeners
// hear about it, and UpdateBanner reloads into it.

let newVersionReady = false;
const listeners = new Set();

function announceNewVersion() {
  newVersionReady = true;
  listeners.forEach((callback) => callback());
}

// Calls `callback` once a new version has taken over this page (right away if it already has).
// Returns a function that stops listening.
export function onNewVersion(callback) {
  if (newVersionReady) callback();
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

// Calls `onUpdate` once when a new service worker takes over the page. On a first visit the page starts with no
// service worker and the first one takes over straight away: that isn't an update, so it's skipped.
export function watchForNewVersion(container, onUpdate) {
  let controlled = Boolean(container.controller);
  let notified = false;
  container.addEventListener("controllerchange", () => {
    if (!controlled) {
      controlled = true;
      return;
    }
    if (notified) return;
    notified = true;
    onUpdate();
  });
}

export function register() {
  if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

  watchForNewVersion(navigator.serviceWorker, announceNewVersion);

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`);

      // A home screen app is often resumed rather than reopened, and can stay open for days. Look for a new version
      // whenever it comes back to the foreground.
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") registration.update().catch(() => {});
      });
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  });
}
