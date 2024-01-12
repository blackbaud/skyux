export interface AgGridDemoRow {
  name: string;
  age: number;
  department: string;
  jobTitle: string;
}

export const AG_GRID_DEMO_DATA = [
  {
    name: 'Billy Bob',
    age: 55,
    department: 'Customer Support',
    jobTitle: 'Customer Support Representative',
    jobLevel: '🥈',
  },
  {
    name: 'Jane Deere',
    age: 33,
    department: 'Engineering',
    jobTitle: 'Software Engineer',
    jobLevel: '🥇',
  },
  {
    name: 'John Doe',
    age: 38,
    department: 'Engineering',
    jobTitle: 'UX Designer',
  },
  {
    name: 'David Smith',
    age: 51,
    department: 'Engineering',
    jobTitle: 'Software Engineer',
    jobLevel: '🥉',
  },
  {
    name: 'Emily Johnson',
    age: 41,
    department: 'Marketing',
    jobTitle: 'Customer Support Representative',
  },
  {
    name: 'Nicole Davidson',
    age: 22,
    startDate: new Date('11/1/2019'),
    department: 'Marketing',
    jobTitle: 'Account Manager',
    jobLevel: '🥈',
  },
  {
    name: 'Carl Roberts',
    age: 23,
    startDate: new Date('11/1/2019'),
    department: 'Marketing',
    jobTitle: 'Social Media Coordinator',
    jobLevel: '🥇',
  },
];
