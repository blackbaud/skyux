export const iconMap: Record<
  string,
  {
    name: string;
    size: number;
  }
> = {
  sortDescending: {
    name: 'chevron-down',
    size: 16,
  },
  sortAscending: {
    name: 'chevron-up',
    size: 16,
  },
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
  columnMovePin: {
    name: 'arrow-move',
    size: 20,
  },
};
export type IconMapType = typeof iconMap;
