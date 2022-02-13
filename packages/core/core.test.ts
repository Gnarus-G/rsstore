import { createStore } from ".";
import { getMockSubsribers } from "./testUtils";

describe("createStore", () => {
  const store = createStore({
    data: "value",
  });

  it("calls back all subscribers on update", () => {
    const newState = { data: "new value" };
    const mockSubsribers = getMockSubsribers();

    mockSubsribers.forEach((s) => store.subscribe(s));

    store.set(newState);
    mockSubsribers.forEach((s) =>
      expect(s).toHaveBeenNthCalledWith(1, newState)
    );

    store.update((_) => newState);
    mockSubsribers.forEach((s) =>
      expect(s).toHaveBeenNthCalledWith(1, newState)
    );
  });

  it("supports unsubscribing", () => {
    const mockSubbers = getMockSubsribers();
    const unsubbers = mockSubbers.map((s) => store.subscribe(s));

    unsubbers.forEach((un) => un());

    store.set({ data: "123" });
    mockSubbers.forEach((s) => expect(s).not.toHaveBeenCalled());
  });

  it("supports updating state with a function that accepts the previous", () => {
    const store = createStore({
      username: "johnjane",
      avatar: "",
    });

    store.subscribe((state) =>
      expect(state).toEqual({
        username: "johnjane",
        avatar: "imagelink",
      })
    );

    store.update((prev) => ({
      username: prev.username,
      avatar: "imagelink",
    }));
  });

  it("always reference the most recent previous state in the update function", () => {
    const store = createStore(0);

    store.update((prev) => prev + 3);

    store.subscribe((state) => expect(state).toBe(93));

    store.update((prev) => prev + 90);
  });

  it("supports destructing the methods", () => {
    const { set, subscribe, update } = createStore("value");

    expect(() => set("wer")).not.toThrow();

    expect(() => update((prev) => prev + "wer")).not.toThrow();

    expect(() => subscribe(() => {})).not.toThrow();
  });

  it("supports creating custom adaptions", () => {
    const { subscribe, set, update } = createStore(0);

    const customStore = {
      subscribe,
      inc(by: number) {
        update((c) => c + by);
      },
      decrement(by: number) {
        update((c) => c - by);
      },
      reset() {
        set(0);
      },
    };

    customStore.inc(5);
    const unsub = customStore.subscribe((c) => expect(c).toBe(3));
    customStore.decrement(2);

    unsub();

    customStore.subscribe((c) => expect(c).toBe(0));
    customStore.reset();
  });
});
