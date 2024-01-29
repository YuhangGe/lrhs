import { useEffect, useState } from 'react';
import { Emitter } from './emitter';
import { Signal } from './signal';

const NO_DATA_WARNING = 'store has not been initialized, use resetStore to set data';

export function createStore<S extends object>(data?: S) {
  let plainData = data;
  const emitter = new Emitter();
  const resetSignal = new Signal();
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

    function set(p: P, v: S[P]) {
      if (!plainData) {
        // eslint-disable-next-line no-console
        console.warn(NO_DATA_WARNING);
        return;
      }
      const oldV = plainData?.[p];
      if (oldV === v) return; // ignore if nothing changed
      plainData[p] = v;
      emitter.emit(p as string, v);
    }

    return [
      data,
      (v: S[P]) => {
        set(propName, v);
      },
    ] as [S[P], (v: S[P]) => void];
  }
  function resetStore(data: S) {
    plainData = data;
    resetSignal.emit();
  }
  return {
    useStore,
    resetStore,
    /**
     * get inner plain data of store
     */
    getStore() {
      return plainData;
    },
  };
}
