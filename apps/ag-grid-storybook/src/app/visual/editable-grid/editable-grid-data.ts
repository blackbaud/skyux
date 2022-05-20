export class EditableGridPerson {
  public id: string;
  public name: string;
}

export class EditableGridRow {
  public name: string;
  public value1?: number;
  public value2?: number;
  public value3?: number;
  public target: number;
  public total?: number;
  public dueDate: Date | string;
  public completedDate?: Date | string;
  public primaryContact?: EditableGridPerson;
  public currencyAmount?: number;
}

export const EDITABLE_GRID_DATA: EditableGridRow[] = [
  {
    name: 'Yearly team goal 1',
    value1: 102,
    value2: 77,
    target: 150,
    dueDate: '2019-12-31T08:44:02.443-05:00',
    completedDate: new Date('4/15/2019'),
    primaryContact: { id: '1', name: 'John Doe' },
    currencyAmount: 2,
  },
  {
    name: 'First quarter team goal 1',
    value1: 50,
    value2: 23,
    value3: 54,
    target: 125,
    dueDate: new Date('3/31/2019'),
    completedDate: '2019-03-28T08:44:02.443-05:00',
    currencyAmount: 15,
  },
  {
    name: 'First quarter team goal 2',
    value1: 25,
    value2: 32,
    value3: 30,
    target: 60,
    dueDate: new Date('3/31/2019'),
    completedDate: new Date('3/21/2019'),
    currencyAmount: 215,
  },
  {
    name: 'Yearly department goal 1',
    value1: 15,
    target: 300,
    dueDate: new Date('12/31/2019'),
    currencyAmount: 2158,
  },
  {
    name: 'Yearly department goal 2',
    value1: 1005,
    target: 4000,
    dueDate: new Date('12/31/2019'),
    currencyAmount: 28766.2,
  },
  {
    name: 'Second quarter team goal 1',
    value1: 91,
    value2: 150,
    value3: 100,
    target: 300,
    dueDate: new Date('6/30/2019'),
    completedDate: new Date('5/5/2019'),
    currencyAmount: 2.43,
  },
  {
    name: 'Second quarter team goal 2',
    value1: 500,
    target: 750,
    dueDate: new Date('6/30/2019'),
    currencyAmount: 0.243,
  },
  {
    name: 'Third quarter team goal 1',
    target: 325,
    dueDate: new Date('9/30/2019'),
  },
  {
    name: 'Third quarter team goal 2',
    target: 15,
    dueDate: new Date('9/30/2019'),
  },
  {
    name: 'Fourth quarter team goal 2',
    target: 200,
    dueDate: new Date('12/31/2019'),
  },
  {
    name: 'Fourth quarter team goal 2',
    target: 75,
    dueDate: new Date('12/31/2019'),
  },
];

export const EDITABLE_GRID_AUTOCOMPLETE_OPTIONS: EditableGridPerson[] = [
  {
    id: '1',
    name: 'John Doe',
  },
  {
    id: '2',
    name: 'Jane Smith',
  },
  {
    id: '3',
    name: 'David Johnson',
  },
  {
    id: '4',
    name: 'Cathy Thomas',
  },
];
