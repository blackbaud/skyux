export interface DataGridSortingRow {
  id: string;
  name: string;
  age: number;
  startDate: Date;
}

export const DATA_GRID_DEMO_DATA: DataGridSortingRow[] = [
  { id: '1', name: 'Billy Bob', age: 55, startDate: new Date('12/1/1994') },
  { id: '2', name: 'Jane Deere', age: 33, startDate: new Date('7/15/2009') },
  { id: '3', name: 'John Doe', age: 38, startDate: new Date('9/1/2017') },
  { id: '4', name: 'David Smith', age: 51, startDate: new Date('1/1/2012') },
  { id: '5', name: 'Emily Johnson', age: 41, startDate: new Date('1/15/2014') },
];
