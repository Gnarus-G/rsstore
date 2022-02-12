type Subscriber<T> = (state: T) => void;

type UnsubFunc = () => void;

type UpdateFunc<T> = (prev: T) => T;

export class Store<T> {
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
}

export class WritabeStore<T> extends Store<T> {
  constructor(private state: T) {
    super();
    this.set = this.set.bind(this);
    this.update = this.update.bind(this);
  }

  set(state: T) {
    this.state = state;
    this.subscribers.forEach((s) => s(state));
  }

  update(updater: UpdateFunc<T>) {
    this.state = updater(this.state);
    this.subscribers.forEach((s) => s(this.state));
  }
}

export default function createStore<T>(initialState: T) {
  return new WritabeStore(initialState);
}
