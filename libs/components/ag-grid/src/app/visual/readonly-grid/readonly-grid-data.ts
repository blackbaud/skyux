export class ReadonlyGridRow {
  public id: string;
  public name: string;
  public value: number;
  public startDate: Date;
  public endDate: Date;
  public comment?: string;
  public status: string;
  public selected: boolean;
}

export class RowStatusNames {
  public static readonly COMPLETE: string = 'Complete';
  public static readonly CURRENT: string = 'Current';
  public static readonly BEHIND: string = 'Behind';
}

export const READONLY_GRID_DATA: ReadonlyGridRow[] = [
  {
    id: '0',
    name: 'Yearly team goal 1',
    value: 102,
    startDate: new Date('1/1/2019'),
    endDate: new Date('12/31/2019'),
    status: RowStatusNames.CURRENT,
    selected: false
  },
  {
    id: '1',
    name: 'First quarter team goal 1',
    value: 50,
    startDate: new Date('1/1/2019'),
    endDate: new Date('3/31/2019'),
    comment: `We completed this goal one month early. For the next quarter,
    we are going to double our target to further challenge ourselves.`,
    status: RowStatusNames.COMPLETE,
    selected: false
  },
  {
    id: '2',
    name: 'First quarter team goal 2',
    value: 25,
    startDate: new Date('1/1/2019'),
    endDate: new Date('3/31/2019'),
    status: RowStatusNames.COMPLETE,
    selected: false
  },
  {
    id: '3',
    name: 'Yearly department goal 1',
    value: 15,
    startDate: new Date('1/1/2019'),
    endDate: new Date('12/31/2019'),
    comment: `Priorities changed and we had to shift resources away from this goal.`,
    status: RowStatusNames.BEHIND,
    selected: true
  },
  {
    id: '4',
    name: 'Yearly department goal 2',
    value: 1005,
    startDate: new Date('1/1/2019'),
    endDate: new Date('12/31/2019'),
    status: RowStatusNames.CURRENT,
    selected: false
  },
  {
    id: '5',
    name: 'Second quarter team goal 1',
    value: 91,
    startDate: new Date('4/1/2019'),
    endDate: new Date('6/30/2019'),
    status: RowStatusNames.CURRENT,
    selected: false
  },
  {
    id: '6',
    name: 'Second quarter team goal 2',
    value: 500,
    startDate: new Date('4/1/2019'),
    endDate: new Date('6/30/2019'),
    status: RowStatusNames.CURRENT,
    selected: true
  },
  {
    id: '7',
    name: 'Third quarter team goal 1',
    value: 0,
    startDate: new Date('7/1/2019'),
    endDate: new Date('9/30/2019'),
    comment: 'Not yet started',
    status: RowStatusNames.CURRENT,
    selected: false
  },
  {
    id: '8',
    name: 'Third quarter team goal 2',
    value: 0,
    startDate: new Date('4/1/2019'),
    endDate: new Date('9/30/2019'),
    comment: 'Not yet started',
    status: RowStatusNames.CURRENT,
    selected: false
  },
  {
    id: '9',
    name: 'Fourth quarter team goal 2',
    value: 0,
    startDate: new Date('10/1/2019'),
    endDate: new Date('12/31/2019'),
    comment: 'Not yet started',
    status: RowStatusNames.CURRENT,
    selected: false
  },
  {
    id: '10',
    name: 'Yearly team goal 1',
    value: 102,
    startDate: new Date('1/1/2019'),
    endDate: new Date('12/31/2019'),
    status: RowStatusNames.CURRENT,
    selected: false
  },
  {
    id: '11',
    name: 'First quarter team goal 1',
    value: 50,
    startDate: new Date('1/1/2019'),
    endDate: new Date('3/31/2019'),
    comment: `We completed this goal one month early. For the next quarter,
    we are going to double our target to further challenge ourselves.`,
    status: RowStatusNames.COMPLETE,
    selected: false
  },
  {
    id: '12',
    name: 'First quarter team goal 2',
    value: 25,
    startDate: new Date('1/1/2019'),
    endDate: new Date('3/31/2019'),
    status: RowStatusNames.COMPLETE,
    selected: false
  },
  {
    id: '13',
    name: 'Yearly department goal 1',
    value: 15,
    startDate: new Date('1/1/2019'),
    endDate: new Date('12/31/2019'),
    comment: `Priorities changed and we had to shift resources away from this goal.`,
    status: RowStatusNames.BEHIND,
    selected: true
  },
  {
    id: '14',
    name: 'Yearly department goal 2',
    value: 1005,
    startDate: new Date('1/1/2019'),
    endDate: new Date('12/31/2019'),
    status: RowStatusNames.CURRENT,
    selected: false
  },
  {
    id: '15',
    name: 'Second quarter team goal 1',
    value: 91,
    startDate: new Date('4/1/2019'),
    endDate: new Date('6/30/2019'),
    status: RowStatusNames.CURRENT,
    selected: false
  },
  {
    id: '16',
    name: 'Second quarter team goal 2',
    value: 500,
    startDate: new Date('4/1/2019'),
    endDate: new Date('6/30/2019'),
    status: RowStatusNames.CURRENT,
    selected: true
  },
  {
    id: '17',
    name: 'Third quarter team goal 1',
    value: 0,
    startDate: new Date('7/1/2019'),
    endDate: new Date('9/30/2019'),
    comment: 'Not yet started',
    status: RowStatusNames.CURRENT,
    selected: false
  },
  {
    id: '18',
    name: 'Third quarter team goal 2',
    value: 0,
    startDate: new Date('4/1/2019'),
    endDate: new Date('9/30/2019'),
    comment: 'Not yet started',
    status: RowStatusNames.CURRENT,
    selected: false
  },
  {
    id: '19',
    name: 'Fourth quarter team goal 2',
    value: 0,
    startDate: new Date('10/1/2019'),
    endDate: new Date('12/31/2019'),
    comment: 'Not yet started',
    status: RowStatusNames.CURRENT,
    selected: false
  }
];
