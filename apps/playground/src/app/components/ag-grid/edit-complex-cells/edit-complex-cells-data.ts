export class EditableGridOption {
  public id: number;
  public name: string;
  public validOption: boolean;
}

export class EditableGridRow {
  public id: string;
  public name: string;
  public language: 'English' | 'Spanish' | 'French' | 'Portuguese' | '(other)';
  public validationAutocomplete?: EditableGridOption;
  public validationCurrency?: number | string;
  public validationDate: Date;
  public lookupSingle: { id: string; name: string; interestingFact: string }[];
  public lookupMultiple: {
    id: string;
    name: string;
    interestingFact: string;
  }[];
  public lookupAsync: {
    id: string;
    name: string;
  }[];
}

function getDay(i: number) {
  const dates = [
    new Date(1955, 10, 5),
    new Date(1979, 5, 13),
    new Date(1985, 9, 26),
    new Date(1992, 0, 12),
    new Date(1993, 1, 2),
    new Date(1996, 6, 4),
    new Date(1997, 7, 29),
    new Date(2000, 1, 0),
    new Date(2004, 8, 22),
    new Date(2012, 11, 21),
    new Date(2016, 1, 14),
    new Date(2063, 5, 3),
  ];
  return dates[i];
}

export const EDITABLE_GRID_OPTIONS: EditableGridOption[] = Array.from(
  Array(4).keys()
).map((i) => {
  return {
    id: i,
    name: `Option ${i + 1}`,
    validOption: i % 2 === 0,
  };
});

export const EDITABLE_GRID_LOOKUP = Array.from(Array(50).keys()).map((i) => {
  return {
    id: `record_${i + 1}`,
    name: `Record ${i + 1}`,
    interestingFact: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis venenatis enim, ut elementum ante pellentesque quis.`,
  };
});

export const EDITABLE_GRID_LOOKUP_ASYNC = Array.from(Array(120).keys()).map(
  (i) => {
    const clusterSize = 3 + Math.floor(i / 26);
    const cycleOffset = (clusterSize * i) % Math.ceil(26 - clusterSize);
    const offset = 65 + cycleOffset;
    const characters = Array.from(Array(clusterSize).keys()).map((j) =>
      String.fromCharCode(offset + j)
    );
    return {
      id: `async_${i + 1}`,
      name: `${characters.join('')}`,
    };
  }
);

export const EDITABLE_GRID_DATA_FACTORY = function (
  startAt: number,
  numberOfRows: number,
  skipIds: string[] = []
): EditableGridRow[] {
  const editableGridRows: EditableGridRow[] = Array.from(
    Array(numberOfRows).keys()
  ).map((n) => {
    const i = n + startAt;
    const lookupKey = i % Math.floor(EDITABLE_GRID_LOOKUP.length / 4);
    return {
      id: `${i}`,
      name: `Person ${i + 1}`,
      language: 'English',
      validationAutocomplete:
        EDITABLE_GRID_OPTIONS[i % EDITABLE_GRID_OPTIONS.length],
      validationCurrency:
        i % 3 === 0
          ? parseFloat((1.23 * i).toFixed(2))
          : i % 3 === 2
          ? 'other value'
          : '',
      validationDate: getDay(i + 1),
      lookupSingle: EDITABLE_GRID_LOOKUP.filter((value) => {
        return `record_${lookupKey * 3 + 1}` === value.id;
      }),
      lookupMultiple: EDITABLE_GRID_LOOKUP.filter((value) => {
        return [
          `record_${lookupKey * 3 + 2}`,
          `record_${lookupKey * 3 + 3}`,
          `record_${lookupKey * 3 + 4}`,
        ].includes(value.id);
      }),
      lookupAsync: EDITABLE_GRID_LOOKUP_ASYNC.filter((value) => {
        return (
          `async_${1 + (i % EDITABLE_GRID_LOOKUP_ASYNC.length)}` === value.id
        );
      }),
    };
  });
  return editableGridRows.filter((value) => {
    return !(skipIds || []).includes(value.id);
  });
};

export const EDITABLE_GRID_DATA: EditableGridRow[] = EDITABLE_GRID_DATA_FACTORY(
  0,
  10
);
