import { FC } from 'react';

import { useStore } from './store';

export const C: FC = () => {
  const [a, setA] = useStore('a');
  const [b, setB] = useStore('b');
  return (
    <div>
      <h2>Component C</h2>
      <p>
        Scope "a": {a}{' '}
        <button
          onClick={() => {
            setA(a + 1);
          }}
        >
          Update
        </button>
      </p>
      <p>
        Scope "b": {b}{' '}
        <button
          onClick={() => {
            setB(b + b);
            setA(a + 1);
          }}
        >
          Update
        </button>
      </p>
    </div>
  );
};
