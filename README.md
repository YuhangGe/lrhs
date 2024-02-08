# light react hook store

> react light weight data share store, with strict type.

## Usage

`See ``demo`` directory for more usage.`

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
const [c] = useStore('c'); // bad. compile error, somestore has no propery named c
```
