export interface AutocompleteOption {
  id: string;
  name: string;
}

export const DEPARTMENTS = [
  { id: '1', name: 'Marketing' },
  { id: '2', name: 'Sales' },
  { id: '3', name: 'Engineering' },
  { id: '4', name: 'Customer Support' },
];

export const JOB_TITLES: Record<string, AutocompleteOption[]> = {
  Marketing: [
    { id: '1', name: 'Social Media Coordinator' },
    { id: '2', name: 'Blog Manager' },
    { id: '3', name: 'Events Manager' },
  ],
  Sales: [
    { id: '4', name: 'Business Development Representative' },
    { id: '5', name: 'Account Executive' },
  ],
  Engineering: [
    { id: '6', name: 'Software Engineer' },
    { id: '7', name: 'Senior Software Engineer' },
    { id: '8', name: 'Principal Software Engineer' },
    { id: '9', name: 'UX Designer' },
    { id: '10', name: 'Product Manager' },
  ],
  'Customer Support': [
    { id: '11', name: 'Customer Support Representative' },
    { id: '12', name: 'Account Manager' },
    { id: '13', name: 'Customer Support Specialist' },
  ],
};

export interface AgGridDemoRow {
  name: string;
  age: number;
  department: AutocompleteOption[];
}

export const AG_GRID_DEMO_DATA: AgGridDemoRow[] = [
  {
    name: 'Billy Bob',
    age: 55,
    department: [DEPARTMENTS[3]],
  },
  {
    name: 'Jane Deere',
    age: 33,
    department: [DEPARTMENTS[2]],
  },
  {
    name: 'John Doe',
    age: 38,
    department: [DEPARTMENTS[1]],
  },
];
