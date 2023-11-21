export type SkyGridOptions = {
  columnPickerEnabled: boolean;
  enableTopScroll: boolean;
  filterButtonEnabled: boolean;
  listDescriptor?: string;
  multiselectToolbarEnabled: boolean;
  name: string;
  pageQueryParam?: string;
  pageSize: number;
  searchEnabled: boolean;
  selectedColumnIds?: string[];
  settingsKey?: string;
  sortEnabled: boolean;
  totalRows?: number;
  viewId: string;
  visibleRows: number | 'fit' | 'all';
};

export const SkyGridDefaultOptions: SkyGridOptions = {
  columnPickerEnabled: false,
  enableTopScroll: false,
  filterButtonEnabled: false,
  multiselectToolbarEnabled: false,
  name: 'Grid',
  pageSize: 10,
  searchEnabled: true,
  sortEnabled: true,
  viewId: `SKY_GRID_VIEW_${Date.now()}`,
  visibleRows: 'all',
};
