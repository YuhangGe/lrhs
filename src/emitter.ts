export type EmitterListener<P1 = unknown, P2 = unknown> = (arg1?: P1, arg2?: P2) => void;

export class Emitter {
  #lismap: Map<string | symbol, Set<EmitterListener>> = new Map();
  on(eventName: string | symbol, eventListener: EmitterListener) {
    let arr = this.#lismap.get(eventName);
    if (!arr) {
      this.#lismap.set(eventName, (arr = new Set()));
    }
    arr.add(eventListener);
    return () => {
      this.off(eventName, eventListener);
    };
  }
  off(eventName: string | symbol, eventListener?: EmitterListener) {
    const arr = this.#lismap.get(eventName);
    if (!arr) {
      return;
    }
    if (!eventListener) {
      arr.clear();
    } else {
      arr.delete(eventListener);
    }
  }
  clear() {
    this.#lismap.clear();
  }
  emit<P1 = unknown, P2 = unknown>(eventName: string | symbol, arg1?: P1, arg2?: P2) {
    const arr = this.#lismap.get(eventName);
    arr?.forEach((listener) => {
      listener(arg1, arg2);
    });
  }
}
