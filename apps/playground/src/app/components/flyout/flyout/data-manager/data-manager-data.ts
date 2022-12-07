export interface SkyAutocompleteOption {
  id: string;
  name: string;
}

export const SKY_DEPARTMENTS = [
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

export const SKY_JOB_TITLES: { [name: string]: SkyAutocompleteOption[] } = {
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

export interface SkyAgGridDemoRow {
  selected: boolean;
  name: string;
  age: number;
  startDate: Date;
  endDate?: Date;
  department: SkyAutocompleteOption;
  jobTitle?: SkyAutocompleteOption;
}

export const SKY_AG_GRID_DEMO_DATA = [
  {
    selected: true,
    name: 'Billy Bob',
    age: 55,
    startDate: new Date('12/1/1994'),
    department: SKY_DEPARTMENTS[3],
    jobTitle: SKY_JOB_TITLES['Customer Support'][1],
  },
  {
    selected: false,
    name: 'Jane Deere',
    age: 33,
    startDate: new Date('7/15/2009'),
    department: SKY_DEPARTMENTS[2],
    jobTitle: SKY_JOB_TITLES['Engineering'][2],
  },
  {
    selected: false,
    name: 'John Doe',
    age: 38,
    startDate: new Date('9/1/2017'),
    endDate: new Date('9/30/2017'),
    department: SKY_DEPARTMENTS[1],
    jobTitle: SKY_JOB_TITLES['Sales'][1],
  },
  {
    selected: false,
    name: 'David Smith',
    age: 51,
    startDate: new Date('1/1/2012'),
    endDate: new Date('6/15/2018'),
    department: SKY_DEPARTMENTS[2],
    jobTitle: SKY_JOB_TITLES['Engineering'][4],
  },
  {
    selected: true,
    name: 'Emily Johnson',
    age: 41,
    startDate: new Date('1/15/2014'),
    department: SKY_DEPARTMENTS[0],
    jobTitle: SKY_JOB_TITLES['Marketing'][2],
  },
  {
    selected: false,
    name: 'Nicole Davidson',
    age: 22,
    startDate: new Date('11/1/2019'),
    department: SKY_DEPARTMENTS[2],
    jobTitle: SKY_JOB_TITLES['Engineering'][0],
  },
  {
    selected: false,
    name: 'Carl Roberts',
    age: 23,
    startDate: new Date('11/1/2019'),
    department: SKY_DEPARTMENTS[2],
    jobTitle: SKY_JOB_TITLES['Engineering'][3],
  },
];
