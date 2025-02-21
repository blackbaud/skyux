export const iconMap: Record<
  string,
  {
    defaultName: string;
    modernName?: string;
    defaultSize: number;
    modernSize?: number;
  }
> = {
  sortDescending: {
    defaultName: 'caret-down',
    defaultSize: 16,
    modernName: 'chevron-down',
    modernSize: 16,
  },
  sortAscending: {
    defaultName: 'caret-up',
    defaultSize: 16,
    modernName: 'chevron-up',
    modernSize: 16,
  },
  columnMoveMove: {
    defaultName: 'arrow-move',
    defaultSize: 20,
  },
  columnMoveHide: {
    defaultName: 'eye-off',
    defaultSize: 16,
  },
  columnMoveLeft: {
    defaultName: 'arrow-move',
    defaultSize: 20,
  },
  columnMoveRight: {
    defaultName: 'arrow-move',
    defaultSize: 20,
  },
  columnMovePin: {
    defaultName: 'arrow-move',
    defaultSize: 20,
  },
};
export type IconMapType = typeof iconMap;
