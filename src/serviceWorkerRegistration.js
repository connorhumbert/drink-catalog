// Registers the service worker in production builds, so the app opens without a connection.
// New versions install themselves (see service-worker.js) and show up the next time the app is opened or refreshed.

export function register() {
  if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`);

      // An installed app can stay open for days; look for a new version whenever it comes back to the foreground.
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") registration.update().catch(() => {});
      });
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  });
}
