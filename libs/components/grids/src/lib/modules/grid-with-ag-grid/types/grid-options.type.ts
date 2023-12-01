export type SkyGridOptions = {
  columnPickerEnabled: boolean;
  enableMultiselect: boolean;
  filterButtonEnabled: boolean;
  listDescriptor?: string;
  hasToolbar: boolean;
  maxColWidth: number;
  minColWidth: number;
  name: string;
  pageQueryParam?: string;
  pageSize: number;
  rowHighlightId?: string;
  searchEnabled: boolean;
  selectedColumnIds?: string[];
  settingsKey?: string;
  showTopScroll: boolean;
  sortEnabled: boolean;
  totalRows?: number;
  viewId: string;
  visibleRows: number | 'fit' | 'all';
  multiselectRowId?: string;
};

export const SkyGridDefaultOptions: SkyGridOptions = {
  columnPickerEnabled: false,
  enableMultiselect: false,
  showTopScroll: false,
  filterButtonEnabled: false,
  hasToolbar: false,
  maxColWidth: 9999,
  minColWidth: 50,
  name: 'Grid',
  pageSize: 0,
  searchEnabled: true,
  sortEnabled: true,
  viewId: `SKY_GRID_VIEW_${Date.now()}`,
  visibleRows: 'all',
};
