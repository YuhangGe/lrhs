import kkstore from '../../../src';

export interface SomeData {
  a: number;
  b: string;
}

const { useStore, resetStore, getStore } = kkstore<SomeData>();

export { useStore, resetStore, getStore };
