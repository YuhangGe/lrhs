# light react hook store

> react light weight data share store, with strict type.

## Usage

```ts
// /src/store/somestore.ts
import store from 'lrhs';
const { useStore } = store({
  a: 10,
  b: 'hello',
});
export { useStore };

// /src/app/pages/somecomponent.tsx
import { useStore } from '@/store/somestore.ts';
const [a, setA] = useStore('a'); //
setA('ok'); // bad. compile error, type of a must be number
setA(10); // ok
setA((oldValue) => oldValue + 1); // can be set function
const [c] = useStore('c'); // bad. compile error, somestore has no propery named c

// another example
import { createStore } from 'lrhs';
const globalStore = createStore({
  a: 10,
  b: 'hello',
});

globalStore.get('a'); // get property value
globalStore.set('a', 20);
globalStore.set('b', (oldValue) => `${oldValue}.new`);
globalStore.getStore(); // get whole store data object

const [a, setA] = globalStore.useStore('a');
console.log(a);
setA(30);
```
