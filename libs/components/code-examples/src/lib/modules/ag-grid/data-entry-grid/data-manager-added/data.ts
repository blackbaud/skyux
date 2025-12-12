export interface AutocompleteOption {
  id: string;
  name: string;
}

export const DEPARTMENTS = [
  {
    id: '1',
    name: 'Marketing',
  },
  {
    id: '2',
    name: 'Sales',
  },
  {
    id: '3',
    name: 'Engineering',
  },
  {
    id: '4',
    name: 'Customer Support',
  },
];

export const JOB_TITLES: Record<string, AutocompleteOption[]> = {
  Marketing: [
    {
      id: '1',
      name: 'Social Media Coordinator',
    },
    {
      id: '2',
      name: 'Blog Manager',
    },
    {
      id: '3',
      name: 'Events Manager',
    },
  ],
  Sales: [
    {
      id: '4',
      name: 'Business Development Representative',
    },
    {
      id: '5',
      name: 'Account Executive',
    },
  ],
  Engineering: [
    {
      id: '6',
      name: 'Software Engineer',
    },
    {
      id: '7',
      name: 'Senior Software Engineer',
    },
    {
      id: '8',
      name: 'Principal Software Engineer',
    },
    {
      id: '9',
      name: 'UX Designer',
    },
    {
      id: '10',
      name: 'Product Manager',
    },
  ],
  'Customer Support': [
    {
      id: '11',
      name: 'Customer Support Representative',
    },
    {
      id: '12',
      name: 'Account Manager',
    },
    {
      id: '13',
      name: 'Customer Support Specialist',
    },
  ],
};

export interface AgGridDemoRow {
  id: string;
  selected?: boolean;
  name: string;
  age: number;
  startDate: Date;
  endDate?: Date;
  department: AutocompleteOption;
  jobTitle?: AutocompleteOption;
  validationCurrency?: string;
  validationDate?: string;
}

export const AG_GRID_DEMO_DATA: AgGridDemoRow[] = [
  {
    id: '4b7f07b6-d8d3-41cd-84ad-f3ed51cee5c0',
    selected: true,
    name: 'Billy Bob',
    age: 55,
    startDate: new Date('12/1/1994'),
    department: DEPARTMENTS[3],
    jobTitle: JOB_TITLES['Customer Support'][1],
  },
  {
    id: 'aea50a38-aa1e-44e0-94b5-52d3f577767f',
    selected: false,
    name: 'Jane Deere',
    age: 33,
    startDate: new Date('7/15/2009'),
    department: DEPARTMENTS[2],
    jobTitle: JOB_TITLES['Engineering'][2],
  },
  {
    id: 'e74afbe4-5016-4a20-9803-30a301835c4f',
    selected: false,
    name: 'John Doe',
    age: 38,
    startDate: new Date('9/1/2017'),
    endDate: new Date('9/30/2017'),
    department: DEPARTMENTS[1],
    jobTitle: JOB_TITLES['Sales'][1],
  },
  {
    id: '0274faf9-388e-497d-bced-f2bef3eafcfd',
    selected: false,
    name: 'David Smith',
    age: 51,
    startDate: new Date('1/1/2012'),
    endDate: new Date('6/15/2018'),
    department: DEPARTMENTS[2],
    jobTitle: JOB_TITLES['Engineering'][4],
  },
  {
    id: '09b7da69-0272-4fe0-ace3-658a6d8f175c',
    selected: true,
    name: 'Emily Johnson',
    age: 41,
    startDate: new Date('1/15/2014'),
    department: DEPARTMENTS[0],
    jobTitle: JOB_TITLES['Marketing'][2],
  },
  {
    id: '3accf076-fff1-4229-bad3-7d2d42d2c42a',
    selected: false,
    name: 'Nicole Davidson',
    age: 22,
    startDate: new Date('11/1/2019'),
    department: DEPARTMENTS[2],
    jobTitle: JOB_TITLES['Engineering'][0],
  },
  {
    id: 'a8456cf4-4f8d-40ee-a91a-ece9c2327fe4',
    selected: false,
    name: 'Carl Roberts',
    age: 23,
    startDate: new Date('11/1/2019'),
    department: DEPARTMENTS[2],
    jobTitle: JOB_TITLES['Engineering'][3],
  },
];
