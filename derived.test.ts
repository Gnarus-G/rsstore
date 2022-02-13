import createStore from ".";
import derived from "./derived";

describe("derivedStore", () => {
  const store = createStore(0);
  const stringifiedStore = derived(store, (num) => `value is ${num}`);

  it("publishes the derived values instead of the base store's values", () => {
    const unsub = stringifiedStore.subscribe((v) =>
      expect(v).toBe("value is 0")
    );

    store.set(0);

    unsub();

    stringifiedStore.subscribe((v) => expect(v).toBe("value is 9"));
    store.subscribe((v) => expect(v).toBe(9));
    store.set(9);
  });
});
