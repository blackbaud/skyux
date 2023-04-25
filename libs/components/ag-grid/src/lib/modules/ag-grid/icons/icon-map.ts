export const iconMap: {
  [key: string]: {
    faIcon: string;
    skyIcon?: string;
  };
} = {
  sortDescending: {
    faIcon: 'caret-down',
    skyIcon: 'chevron-down',
  },
  sortAscending: {
    faIcon: 'caret-up',
    skyIcon: 'chevron-up',
  },
  columnMoveMove: {
    faIcon: 'arrows',
  },
  columnMoveHide: {
    faIcon: 'eye-slash',
    skyIcon: 'hide',
  },
  columnMoveLeft: {
    faIcon: 'arrows',
  },
  columnMoveRight: {
    faIcon: 'arrows',
  },
  columnMoveGroup: {
    faIcon: 'arrows',
  },
  columnMovePin: {
    faIcon: 'arrows',
  },
  columnGroupOpened: {
    faIcon: 'caret-right',
    skyIcon: 'double-chevron-right',
  },
  columnGroupClosed: {
    faIcon: 'caret-left',
    skyIcon: 'double-chevron-left',
  },
  dropNotAllowed: {
    faIcon: 'ban',
    skyIcon: 'ban',
  },
  menu: {
    faIcon: 'menu',
    skyIcon: 'bars-2',
  },
  filter: {
    faIcon: 'filter',
    skyIcon: 'filter',
  },
  columns: {
    faIcon: 'columns',
    skyIcon: 'columns',
  },
  last: {
    faIcon: 'step-forward',
    skyIcon: 'double-chevron-right',
  },
  next: {
    faIcon: 'caret-right',
    skyIcon: 'chevron-right',
  },
  previous: {
    faIcon: 'caret-left',
    skyIcon: 'chevron-left',
  },
  first: {
    faIcon: 'step-backward',
    skyIcon: 'double-chevron-left',
  },
};
export type IconMapType = typeof iconMap;
