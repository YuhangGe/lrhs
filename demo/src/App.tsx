import { FC } from 'react';

import { A } from './A';
import { B } from './B/B';

export const App: FC = () => {
  return (
    <div>
      <A />
      <B />
    </div>
  );
};
