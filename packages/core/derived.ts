import { IStore, Store } from "./core";

export class DerivedStore<T, R> implements IStore<R> {
  constructor(private original: Store<T>, private transform: (state: T) => R) {}

  subscribe(subscriber: (state: R) => void) {
    return this.original.subscribe((state) =>
      subscriber(this.transform(state))
    );
  }
}

export function derived<T, R>(
  store: Store<T>,
  transform: (state: T) => R
): IStore<R> {
  return new DerivedStore(store, transform);
}
