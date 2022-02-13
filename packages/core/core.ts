type Subscriber<T> = (state: T) => void;

type UnsubFunc = () => void;

type UpdateFunc<T> = (prev: T) => T;

export interface IStore<T> {
  subscribe(subscriber: Subscriber<T>): UnsubFunc;
}

export class Store<T> implements IStore<T> {
  protected subscribers = new Set<Subscriber<T>>();

  constructor() {
    this.subscribe = this.subscribe.bind(this);
  }

  subscribe(subscriber: Subscriber<T>): UnsubFunc {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  protected notify(state: T) {
    this.subscribers.forEach((s) => s(state));
  }
}

export class WritabeStore<T> extends Store<T> {
  constructor(private state: T) {
    super();
    this.set = this.set.bind(this);
    this.update = this.update.bind(this);
  }

  set(state: T) {
    this.state = state;
    this.notify(state);
  }

  update(updater: UpdateFunc<T>) {
    this.state = updater(this.state);
    this.notify(this.state);
  }
}

export function createStore<T>(initialState: T) {
  return new WritabeStore(initialState);
}
