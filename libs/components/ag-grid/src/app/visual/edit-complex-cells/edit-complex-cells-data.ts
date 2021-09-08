export class EditableGridOption {
  public id: number;
  public name: string;
  public validOption: boolean;
}

export class EditableGridRow {
  public name: string;
  public language: 'English' | 'Spanish' | 'French' | 'Portuguese' | '(other)';
  public validationAutocomplete?: EditableGridOption;
  public validationCurrency: string;
  public validationDate: Date;
}

function getDay(i: number) {
  const dates = [
    new Date( 1955, 10, 5),
    new Date( 1979, 5, 13),
    new Date( 1985, 9, 26),
    new Date( 1992, 0, 12),
    new Date( 1993, 1, 2),
    new Date( 1996, 6, 4),
    new Date( 1997, 7, 29),
    new Date( 2000, 1, 0),
    new Date( 2004, 8, 22),
    new Date( 2012, 11, 21),
    new Date( 2016, 1, 14),
    new Date( 2063, 5, 3)
  ];
  return dates[i];
}

export const EDITABLE_GRID_OPTIONS: EditableGridOption[] = Array.from(Array(4).keys()).map((i) => {
  return {
    id: i,
    name: `Option ${i + 1}`,
    validOption: i % 2 === 0
  };
});

export const EDITABLE_GRID_DATA: EditableGridRow[] = Array.from(Array(10).keys()).map((i) => {
  return {
    name: `Person ${i + 1}`,
    language: 'English',
    validationAutocomplete: EDITABLE_GRID_OPTIONS[i % EDITABLE_GRID_OPTIONS.length],
    validationCurrency: (i % 3 === 0 ? `${(1.23 * i).toFixed(2)}` : (i % 3 === 2 ? 'other value' : '')),
    validationDate: getDay(i + 1)
  };
});
