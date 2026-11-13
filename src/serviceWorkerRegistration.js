// Registers the service worker in production builds so the app shell loads offline.
// A newer version waits after downloading; whenUpdateReady() lets the page offer a reload, and applyUpdate() switches over.

let waitingWorker = null;
const listeners = new Set();

function setWaiting(worker) {
  waitingWorker = worker;
  listeners.forEach((listener) => listener());
}

// Calls back once a new version is waiting, right away if one already is. Returns an unsubscribe function.
export function whenUpdateReady(callback) {
  if (waitingWorker) callback();
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function register() {
  if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`);

      // A version downloaded on an earlier visit is still waiting.
      if (registration.waiting && navigator.serviceWorker.controller) setWaiting(registration.waiting);

      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          // A controller already exists, so this is an update rather than the first install.
          if (worker.state === "installed" && navigator.serviceWorker.controller) setWaiting(worker);
        });
      });

      // An installed app can stay open for days; look for a new version whenever it comes back to the foreground.
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") registration.update().catch(() => {});
      });
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  });
}

// Lets the waiting version take over, then reloads once it has.
export function applyUpdate() {
  if (!waitingWorker) {
    window.location.reload();
    return;
  }
  navigator.serviceWorker.addEventListener("controllerchange", () => window.location.reload(), { once: true });
  waitingWorker.postMessage({ type: "SKIP_WAITING" });
}
