import { TypeOfScene } from 'constants';

type TypeOfData = {
  previousScene?: TypeOfScene;
};

const data: TypeOfData = {
  previousScene: undefined,
};

export const getData = <T extends keyof TypeOfData>(key: T): TypeOfData[T] => {
  return data[key];
};

export const setData = <T extends keyof TypeOfData>(key: T, value: TypeOfData[T]) => {
  data[key] = value;
};
