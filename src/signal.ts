type Listener<A = void> = (arg: A) => void;

export class Signal<A = void> {
  /**
   * listeners set
   */
  #l: Set<Listener<A>>;
  constructor() {
    this.#l = new Set();
  }

  on(listener: Listener<A>) {
    this.#l.add(listener);
    return () => {
      this.#l.delete(listener);
    };
  }

  off(listener: Listener<A>) {
    this.#l.delete(listener);
  }

  emit(arg: A) {
    this.#l.forEach((listener) => {
      listener(arg);
    });
  }
}

export function signal() {
  return new Signal();
}
