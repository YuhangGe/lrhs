import { useEffect, useState } from 'react';
import { Emitter } from './emitter';
import { Signal } from './signal';

const NO_DATA_WARNING = 'store has not been initialized, use resetStore to set data';

export function createStore<S extends object>(data?: S) {
  let plainData = data;
  const emitter = new Emitter();
  const resetSignal = new Signal();
  function setProp<T extends keyof S>(prop: T, value: S[T]) {
    if (!plainData) {
      // eslint-disable-next-line no-console
      console.warn(NO_DATA_WARNING);
      return;
    }
    const oldV = plainData?.[prop];
    if (oldV === value) return; // ignore if nothing changed
    plainData[prop] = value;
    emitter.emit(prop as string, value);
  }
  function useStore<P extends keyof S>(propName: P) {
    if (!plainData) {
      // eslint-disable-next-line no-console
      console.warn(NO_DATA_WARNING);
    }

    const [data, setData] = useState(plainData?.[propName]);

    useEffect(() => {
      function onReset() {
        setData(plainData?.[propName]);
      }
      resetSignal.on(onReset);

      function onUpdate(newValue: S[P]) {
        setData(newValue);
      }
      emitter.on(propName as string, onUpdate);

      return () => {
        resetSignal.off(onReset);
        emitter.off(propName as string, onUpdate);
      };
    }, []);

    return [
      data,
      (v: S[P]) => {
        setProp(propName, v);
      },
    ] as [S[P], (v: S[P]) => void];
  }
  function resetStore(data: S) {
    plainData = data;
    resetSignal.emit();
  }
  function getProp<T extends keyof S>(prop: T): S[T] {
    if (!plainData) {
      // eslint-disable-next-line no-console
      console.warn(NO_DATA_WARNING);
    }
    return plainData?.[prop];
  }

  return {
    useStore,
    resetStore,
    /**
     * get inner plain data of store
     */
    getStore() {
      return plainData as S;
    },
    get: getProp,
    set: setProp,
  };
}
