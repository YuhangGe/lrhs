import { FC } from 'react';
import { useRootStore } from './rootStore';

export const A: FC = () => {
  const [a, setA] = useRootStore('a');
  const [b, setB] = useRootStore('b');

  return (
    <div>
      <h1>Component A </h1>
      <p>
        Root "a": {a}{' '}
        <button
          onClick={() => {
            setA(a + 1);
          }}
        >
          Update
        </button>
      </p>
      <p>
        Root "b": {b}{' '}
        <button
          onClick={() => {
            setB(b + b);
          }}
        >
          Update
        </button>
      </p>
    </div>
  );
};
