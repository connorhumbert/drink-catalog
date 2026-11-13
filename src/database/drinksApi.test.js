import { addDrink, updateDrink } from "./drinksApi";
import { deleteDoc, disableNetwork, doc, enableNetwork, runTransaction, serverTimestamp } from "firebase/firestore";

// Stand-ins for Firestore, so the test can see exactly what each save writes.
jest.mock("./firebase", () => ({ db: {} }));
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(() => ({})),
  doc: jest.fn(() => ({ id: "new-id" })),
  deleteDoc: jest.fn(() => Promise.resolve()),
  disableNetwork: jest.fn(() => Promise.resolve()),
  enableNetwork: jest.fn(() => Promise.resolve()),
  onSnapshot: jest.fn(),
  orderBy: jest.fn(),
  query: jest.fn(),
  runTransaction: jest.fn(),
  serverTimestamp: jest.fn(() => "SERVER_TIME"),
}));

const goldRush = { name: "Gold Rush", booze: "Whiskey/Rye/Bourbon", ingredients: ["2 oz bourbon", "3/4 oz honey syrup"] };

let written;
// The test setup resets every stand-in before each test, so give them their answers again.
beforeEach(() => {
  written = {};
  serverTimestamp.mockReturnValue("SERVER_TIME");
  doc.mockReturnValue({ id: "new-id" });
  deleteDoc.mockResolvedValue();
  disableNetwork.mockResolvedValue();
  enableNetwork.mockResolvedValue();
  runTransaction.mockImplementation(async (db, run) =>
    run({
      get: async () => ({ exists: () => true, data: () => goldRush }),
      set: (ref, data) => (written.set = data),
      update: (ref, data) => (written.update = data),
      delete: () => (written.deleted = true),
    })
  );
});

describe("dates on saved drinks", () => {
  it("a new drink gets both dates from the server's clock", async () => {
    await addDrink(goldRush);
    expect(written.set.createdAt).toBe("SERVER_TIME");
    expect(written.set.updatedAt).toBe("SERVER_TIME");
    expect(written.set.name).toBe("Gold Rush");
  });

  it("an edit updates updatedAt and leaves createdAt alone", async () => {
    await updateDrink("abc", { ...goldRush, name: "Gold Rush (honey)" }, goldRush);
    expect(written.update.updatedAt).toBe("SERVER_TIME");
    expect("createdAt" in written.update).toBe(false);
    expect(written.update.name).toBe("Gold Rush (honey)");
  });

  it("writes only fields the Firestore rules allow", async () => {
    const allowed = ["name", "nameLower", "booze", "ingredients", "glass", "createdAt", "updatedAt"];
    await addDrink({ ...goldRush, glass: "Rocks" });
    await updateDrink("abc", goldRush, goldRush);
    expect(Object.keys(written.set).every((key) => allowed.includes(key))).toBe(true);
    expect(Object.keys(written.update).every((key) => allowed.includes(key))).toBe(true);
  });
});
