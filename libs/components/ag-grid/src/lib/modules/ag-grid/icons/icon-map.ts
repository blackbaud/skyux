export const iconMap: Record<
  string,
  {
    name: string;
    // modern?: string;
    size: number;
    // modernSize?: number;
  }
> = {
  // sortDescending: {
  //   default: 'caret-down',
  //   modern: 'chevron-down',
  // },
  // sortAscending: {
  //   default: 'caret-up',
  //   modern: 'chevron-up',
  // },
  columnMoveMove: {
    name: 'arrow-move',
    size: 20,
  },
  columnMoveHide: {
    name: 'eye-off',
    size: 16,
  },
  columnMoveLeft: {
    name: 'arrow-move',
    size: 20,
  },
  columnMoveRight: {
    name: 'arrow-move',
    size: 20,
  },
  // columnMoveGroup: {
  //   default: 'arrow-move',
  // },
  columnMovePin: {
    name: 'arrow-move',
    size: 20,
  },
  // columnGroupOpened: {
  //   default: 'caret-right',
  //   modern: 'chevron-double-right',
  // },
  // columnGroupClosed: {
  //   default: 'caret-left',
  //   modern: 'chevron-double-left',
  // },
  // dropNotAllowed: {
  //   default: 'circle-off',
  // },
  // menu: {
  //   default: 'navigation',
  // },
  // filter: {
  //   default: 'filter',
  // },
  // columns: {
  //   default: 'table-freeze-column',
  // },
  // last: {
  //   default: 'chevron-double-right',
  // },
  // next: {
  //   default: 'caret-right',
  //   modern: 'chevron-right',
  // },
  // previous: {
  //   default: 'caret-left',
  //   modern: 'chevron-left',
  // },
  // first: {
  //   default: 'chevron-double-left',
  // },
};
export type IconMapType = typeof iconMap;
