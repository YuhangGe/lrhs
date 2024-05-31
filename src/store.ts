import { useEffect, useState } from 'react';
import { Emitter } from './emitter';
import { Signal } from './signal';

const NO_DATA_WARNING = 'store has not been initialized, use resetStore to set data';

export function createStore<S extends object>(data?: S) {
  let plainData = data;
  const emitter = new Emitter();
  const resetSignal = new Signal();
  const hooks = new Map<keyof S, Set<(v: unknown) => void>>();
  type SetFn<T extends keyof S> = (oldValue: S[T]) => S[T];
  function setProp<T extends keyof S>(prop: T, valueOrSetFn: S[T] | SetFn<T>) {
    if (!plainData) {
      // eslint-disable-next-line no-console
      console.warn(NO_DATA_WARNING);
      return;
    }
    const oldV = plainData[prop];
    const value = typeof valueOrSetFn === 'function' ? (valueOrSetFn as SetFn<T>)(oldV) : valueOrSetFn;
    if (oldV === value) return; // ignore if nothing changed
    plainData[prop] = value;
    emitter.emit(prop as string, value);
    const hookFnSet = hooks.get(prop);
    hookFnSet?.forEach((hookFn) => hookFn(value));
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
      (v: S[P] | SetFn<P>) => {
        setProp(propName, v);
      },
    ] as [S[P], (v: S[P] | SetFn<P>) => void];
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

  function hook<T extends keyof S>(prop: T, hookFn: (v: S[T]) => void) {
    let fnSet = hooks.get(prop);
    if (!fnSet) {
      hooks.set(prop, (fnSet = new Set()));
    }
    fnSet.add(hookFn);
  }

  return {
    /**
     * hook to use property state of current store object, similar to react useState hook.
     * @param propName property of current store object
     * @returns [property value, property update function]
     */
    useStore,
    /**
     * reset whole store object and emit events of every property
     */
    resetStore,
    /**
     * get inner whole store object
     */
    getStore() {
      return plainData as S;
    },
    get: getProp,
    /**
     * update/set property value and emit event
     * @param prop property name of current store object
     * @param value property value to be updated
     * @param forceUpdate force update and emit event even value not changed, default is false
     */
    set: setProp,
    /**
     * add hook function to property when value of this property is updated
     * @param prop property name of current store object
     * @param hookFn hook function to be executed after the property is changed
     */
    hook,
  };
}
