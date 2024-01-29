export type EmitterListenerWith3Arg<P1, P2, P3> = (arg1: P1, arg2: P2, arg3: P3) => void;
export type EmitterListenerWith2Arg<P1, P2> = (arg1: P1, arg2: P2) => void;
export type EmitterListenerWith1Arg<P1> = (arg1: P1) => void;
export type EmitterListenerWith0Arg = () => void;

type Listener = (...args: unknown[]) => void;
export class Emitter {
  /**
   * event listeners map
   */
  #lismap: Map<string | symbol, Set<Listener>> = new Map();

  on(eventName: string | symbol, eventListener: EmitterListenerWith0Arg): void;
  on<P1>(eventName: string | symbol, eventListener: EmitterListenerWith1Arg<P1>): void;
  on<P1, P2>(eventName: string | symbol, eventListener: EmitterListenerWith2Arg<P1, P2>): void;
  on<P1, P2, P3>(eventName: string | symbol, eventListener: EmitterListenerWith3Arg<P1, P2, P3>): void;
  on(eventName: string | symbol, eventListener: Listener) {
    let arr = this.#lismap.get(eventName);
    if (!arr) {
      this.#lismap.set(eventName, (arr = new Set()));
    }
    arr.add(eventListener);
    return () => {
      this.off(eventName, eventListener);
    };
  }

  off(eventName: string | symbol, eventListener?: EmitterListenerWith0Arg): void;
  off<P1>(eventName: string | symbol, eventListener?: EmitterListenerWith1Arg<P1>): void;
  off<P1, P2>(eventName: string | symbol, eventListener?: EmitterListenerWith2Arg<P1, P2>): void;
  off<P1, P2, P3>(eventName: string | symbol, eventListener?: EmitterListenerWith3Arg<P1, P2, P3>): void;
  off(eventName: string | symbol, eventListener?: Listener) {
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

  emit(eventName: string | symbol): void;
  emit<P1>(eventName: string | symbol, arg1: P1): void;
  emit<P1, P2>(eventName: string | symbol, arg1: P1, arg2: P2): void;
  emit<P1, P2, P3>(eventName: string | symbol, arg1: P1, arg2: P2, arg3: P3): void;
  emit(eventName: string | symbol, ...args: unknown[]) {
    const arr = this.#lismap.get(eventName);
    arr?.forEach((listener) => {
      listener(...args);
    });
  }
}
