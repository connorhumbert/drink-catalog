import { watchForNewVersion } from "./serviceWorkerRegistration";

// A stand-in for navigator.serviceWorker: `takeOver()` is what happens when a service worker starts controlling the page.
function fakeContainer(controller) {
  let handler;
  return {
    controller,
    addEventListener: (type, fn) => {
      if (type === "controllerchange") handler = fn;
    },
    takeOver: () => handler(),
  };
}

describe("watchForNewVersion", () => {
  it("reports a new version taking over a page that already had one", () => {
    const container = fakeContainer({});
    const onUpdate = jest.fn();
    watchForNewVersion(container, onUpdate);
    container.takeOver();
    expect(onUpdate).toHaveBeenCalledTimes(1);
  });

  it("ignores the first service worker on a first visit, but not a later update", () => {
    const container = fakeContainer(null);
    const onUpdate = jest.fn();
    watchForNewVersion(container, onUpdate);
    container.takeOver();
    expect(onUpdate).not.toHaveBeenCalled();
    container.takeOver();
    expect(onUpdate).toHaveBeenCalledTimes(1);
  });

  it("reports only once", () => {
    const container = fakeContainer({});
    const onUpdate = jest.fn();
    watchForNewVersion(container, onUpdate);
    container.takeOver();
    container.takeOver();
    expect(onUpdate).toHaveBeenCalledTimes(1);
  });
});
