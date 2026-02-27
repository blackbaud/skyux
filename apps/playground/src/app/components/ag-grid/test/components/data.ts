export type DataRow = {
  name: string;
  occupation: string;
};

export const DATA: DataRow[] = [
  { name: 'Nick', occupation: 'Baker' },
  { name: 'Jon', occupation: 'Butcher' },
  { name: 'Adam', occupation: 'Candlestick Maker' },
] as const;
