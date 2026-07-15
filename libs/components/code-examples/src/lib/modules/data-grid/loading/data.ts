import { SkyDataGridSort } from '@skyux/data-grid';

export interface DataGridLoadingRow {
  id: string;
  name: string;
  age: number;
  startDate: Date;
}

/**
 * A single page of rows returned from the server, along with the total number
 * of rows available so the grid can size its paging controls.
 */
export interface DataGridServerPage {
  items: DataGridLoadingRow[];
  totalCount: number;
}

const DATA_GRID_DEMO_DATA: DataGridLoadingRow[] = [
  { id: '1', name: 'Billy Bob', age: 55, startDate: new Date('12/1/1994') },
  { id: '2', name: 'Jane Deere', age: 33, startDate: new Date('7/15/2009') },
  { id: '3', name: 'John Doe', age: 38, startDate: new Date('9/1/2017') },
  { id: '4', name: 'David Smith', age: 51, startDate: new Date('1/1/2012') },
  { id: '5', name: 'Emily Johnson', age: 41, startDate: new Date('1/15/2014') },
  {
    id: '6',
    name: 'Nicole Davidson',
    age: 22,
    startDate: new Date('11/1/2019'),
  },
  { id: '7', name: 'Carl Roberts', age: 23, startDate: new Date('11/1/2019') },
  { id: '8', name: 'Maria Garcia', age: 47, startDate: new Date('3/12/2003') },
  { id: '9', name: 'Liang Chen', age: 36, startDate: new Date('5/30/2015') },
  { id: '10', name: 'Aisha Khan', age: 29, startDate: new Date('8/4/2018') },
  { id: '11', name: 'Tom Anderson', age: 60, startDate: new Date('2/2/1989') },
  { id: '12', name: 'Sofia Rossi', age: 44, startDate: new Date('10/20/2006') },
  {
    id: '13',
    name: 'Noah Williams',
    age: 31,
    startDate: new Date('6/18/2013'),
  },
  { id: '14', name: 'Priya Patel', age: 27, startDate: new Date('4/9/2020') },
  { id: '15', name: 'Lucas Martin', age: 39, startDate: new Date('7/1/2011') },
  { id: '16', name: 'Hannah Lee', age: 34, startDate: new Date('9/22/2016') },
  { id: '17', name: 'Omar Haddad', age: 49, startDate: new Date('1/5/2001') },
  { id: '18', name: 'Grace Kim', age: 26, startDate: new Date('12/12/2021') },
  { id: '19', name: 'Ethan Brown', age: 53, startDate: new Date('3/30/1998') },
  {
    id: '20',
    name: 'Olivia Wilson',
    age: 42,
    startDate: new Date('5/14/2008'),
  },
  { id: '21', name: 'Diego Torres', age: 37, startDate: new Date('8/27/2014') },
  { id: '22', name: 'Mei Tanaka', age: 30, startDate: new Date('2/16/2017') },
  { id: '23', name: 'Samuel Owens', age: 58, startDate: new Date('11/3/1992') },
];

function compareRows(
  a: DataGridLoadingRow,
  b: DataGridLoadingRow,
  field: SkyDataGridSort['field'],
): number {
  switch (field) {
    case 'age':
      return a.age - b.age;
    case 'startDate':
      return a.startDate.getTime() - b.startDate.getTime();
    default:
      return a.name.localeCompare(b.name);
  }
}

/**
 * Simulates a server request for a single page of sorted data. A real SPA would
 * issue this request to its backend and let the server apply the sort and paging.
 */
export function getServerPage(options: {
  page: number;
  pageSize: number;
  sort: SkyDataGridSort | undefined;
}): DataGridServerPage {
  const { page, pageSize, sort } = options;
  const sorted = [...DATA_GRID_DEMO_DATA];
  if (sort) {
    sorted.sort((a, b) => compareRows(a, b, sort.field));
    if (sort.direction === 'desc') {
      sorted.reverse();
    }
  }
  const start = (page - 1) * pageSize;
  return {
    items: sorted.slice(start, start + pageSize),
    totalCount: DATA_GRID_DEMO_DATA.length,
  };
}
