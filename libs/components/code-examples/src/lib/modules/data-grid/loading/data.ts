import { SkyDataGridSort } from '@skyux/data-grid';

export interface DataGridLoadingRow {
  id: string;
  name: string;
  age: number;
  startDate: Date;
}

const DATA_GRID_DEMO_DATA: DataGridLoadingRow[] = [
  { id: '1', name: 'Billy Bob', age: 55, startDate: new Date('12/1/1994') },
  { id: '2', name: 'Jane Deere', age: 33, startDate: new Date('7/15/2009') },
  { id: '3', name: 'John Doe', age: 38, startDate: new Date('9/1/2017') },
  { id: '4', name: 'David Smith', age: 51, startDate: new Date('1/1/2012') },
  { id: '5', name: 'Emily Johnson', age: 41, startDate: new Date('1/15/2014') },
];

export function getDataSorted(
  sortField: SkyDataGridSort<DataGridLoadingRow> | undefined,
): DataGridLoadingRow[] {
  const data = [...DATA_GRID_DEMO_DATA] as DataGridLoadingRow[];
  if (sortField) {
    if (sortField.fieldSelector === 'name') {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortField.fieldSelector === 'age') {
      data.sort((a, b) => a.age - b.age);
    } else if (sortField.fieldSelector === 'startDate') {
      data.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    }
    if (sortField.descending) {
      data.reverse();
    }
  }
  return data;
}
