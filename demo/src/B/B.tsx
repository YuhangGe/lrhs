import { FC, useEffect, useState } from 'react';
import { useRootStore } from '../rootStore';
import { C } from './C';
import { useStore, resetStore } from './store';

export const B: FC = () => {
  const [a] = useRootStore('a');
  const [b] = useRootStore('b');
  const [loading, setLoading] = useState(true);
  const [suba] = useStore('a');
  const [subb] = useStore('b');

  useEffect(() => {
    // mock fetch api data then initialize store
    setTimeout(() => {
      resetStore({ a: 999, b: 'nice' });
      setLoading(false);
    }, 5000);
  }, []);

  return (
    <div>
      <h1>Component B </h1>
      <p>Root "a": {a}</p>
      <p>Root "b": {b}</p>
      <br />
      <p>Scope "a": {suba}</p>
      <p>Scope "b": {subb}</p>
      <div>
        {loading ? (
          <p>loading component C...</p>
        ) : (
          <>
            <C />
          </>
        )}
      </div>
    </div>
  );
};
