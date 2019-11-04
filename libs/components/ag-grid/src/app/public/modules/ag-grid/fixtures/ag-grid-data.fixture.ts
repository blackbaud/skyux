export class SkyAgGridRow {
  public name: string;
  public nickname?: string;
  public value?: number;
  public target: number;
  public date?: Date;
  public selected: boolean;
}

export const SKY_AG_GRID_DATA: SkyAgGridRow[] = [
  {
    name: 'Mark',
    value: 7,
    target: 10,
    date: new Date('1/1/19'),
    selected: true
  },
  {
    name: 'Jill',
    target: 12,
    selected: false
  },
  {
    name: 'Jonathan',
    nickname: 'John',
    value: 13,
    target: 9,
    date: new Date('3/1/19'),
    selected: false
  },
  {
    name: 'Mary',
    target: 8,
    selected: true
  }
];
