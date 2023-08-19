import kkstore from '../../src';

interface Boy {
  name: string;
}
const { useStore } = kkstore({
  a: 10,
  b: 'hello',
  c: { name: 'boy-a' } as Boy,
});

export const useRootStore = useStore;
