type Listener = (...args: unknown[]) => void;

export class Signal {
  /**
   * listeners set
   */
  #l: Set<Listener>;
  /**
   * name
   */
  #n?: string | symbol;
  constructor(name?: string | symbol) {
    this.#n = name;
    this.#l = new Set();
  }
  on(listener: Listener) {
    this.#l.add(listener);
    return () => {
      this.#l.delete(listener);
    };
  }
  off(listener: Listener) {
    this.#l.delete(listener);
  }
  emit(...args: unknown[]) {
    this.#l.forEach((listener) => {
      listener(...args);
    });
  }
}

export function signal(name?: string | symbol) {
  return new Signal(name);
}
