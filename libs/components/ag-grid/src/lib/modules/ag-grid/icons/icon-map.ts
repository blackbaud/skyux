export const iconMap: Record<
  string,
  {
    name: string;
    size: number;
  }
> = {
  // header column group shown when expanded (click to contract)
  columnGroupOpened: {
    name: 'chevron-double-left',
    size: 16,
  },

  // header column group shown when contracted (click to expand)
  columnGroupClosed: {
    name: 'chevron-double-right',
    size: 16,
  },

  // column tool panel column group contracted (click to expand)
  columnSelectClosed: {
    name: 'chevron-right',
    size: 24,
  },

  // column tool panel column group expanded (click to contract)
  columnSelectOpen: {
    name: 'chevron-down',
    size: 24,
  },

  // column tool panel header expand/collapse all button, shown
  // when some children are expanded and others are collapsed
  columnSelectIndeterminate: {
    name: 'subtract',
    size: 16,
  },

  // accordion open (filter tool panel group, charts group)
  accordionOpen: {
    name: 'chevron-down',
    size: 24,
  },

  // accordion closed (filter tool panel group, charts group)
  accordionClosed: {
    name: 'chevron-right',
    size: 24,
  },

  // accordion indeterminate - shown when some children are expanded and
  // others are collapsed (filter tool panel group, charts group)
  accordionIndeterminate: {
    name: 'subtract',
    size: 16,
  },

  // shown on drag and drop image component icon while dragging
  // column to the side of the grid to pin
  columnMovePin: {
    name: 'arrow-move',
    size: 20,
  },

  // shown on drag and drop image component icon while dragging over
  // part of the page that is not a drop zone
  columnMoveHide: {
    name: 'eye-off',
    size: 16,
  },

  // shown on drag and drop image component icon while dragging
  // columns to reorder
  columnMoveMove: {
    name: 'arrow-move',
    size: 20,
  },

  // animating icon shown when dragging a column to the right of
  // the grid causes horizontal scrolling
  columnMoveLeft: {
    name: 'arrow-move',
    size: 20,
  },

  // animating icon shown when dragging a column to the left of
  // the grid causes horizontal scrolling
  columnMoveRight: {
    name: 'arrow-move',
    size: 20,
  },

  // shown on drag and drop image component icon while dragging
  // over Row Groups drop zone
  columnMoveGroup: {
    name: 'group',
    size: 20,
  },

  // shown on drag and drop image component icon while dragging
  // over Values drop zone
  columnMoveValue: {
    name: 'calculator',
    size: 16,
  },

  // shown on drag and drop image component icon while dragging
  // over pivot drop zone
  columnMovePivot: {
    name: 'table-freeze-column',
    size: 16,
  },

  // shown on drag and drop image component icon while dragging
  // over drop zone that doesn't support it, e.g.
  // string column over aggregation drop zone
  dropNotAllowed: {
    name: 'prohibited',
    size: 16,
  },

  // shown on row group when contracted (click to expand)
  groupContracted: {
    name: 'chevron-right',
    size: 24,
  },

  // shown on row group when expanded (click to contract)
  groupExpanded: {
    name: 'chevron-down',
    size: 24,
  },

  // set filter tree list group contracted (click to expand)
  setFilterGroupClosed: {
    name: 'chevron-right',
    size: 24,
  },

  // set filter tree list group expanded (click to contract)
  setFilterGroupOpen: {
    name: 'chevron-down',
    size: 24,
  },

  // set filter tree list expand/collapse all button, shown when
  // some children are expanded and
  // others are collapsed
  setFilterGroupIndeterminate: {
    name: 'subtract',
    size: 16,
  },

  // set filter async values loading
  setFilterLoading: {
    name: 'spinner-ios',
    size: 16,
  },

  // context menu chart item
  chart: {
    name: 'data-bar-vertical-ascending',
    size: 16,
  },

  // dialog title bar
  close: {
    name: 'close',
    size: 24,
  },

  // X (remove) on column 'pill' after adding it to a drop zone list
  cancel: {
    name: 'close',
    size: 24,
  },

  // indicates the currently active pin state in the "Pin column"
  // sub-menu of the column menu
  check: {
    name: 'checkmark',
    size: 20,
  },

  // "go to first" button in pagination controls
  first: {
    name: 'arrow-previous',
    size: 16,
  },

  // "go to previous" button in pagination controls
  previous: {
    name: 'chevron-left',
    size: 24,
  },

  // "go to next" button in pagination controls
  next: {
    name: 'chevron-right',
    size: 24,
  },

  // "go to last" button in pagination controls
  last: {
    name: 'arrow-next',
    size: 16,
  },

  // shown on top right of chart when chart is linked to range
  // data (click to unlink)
  linked: {
    name: 'link-dismiss',
    size: 16,
  },

  // shown on top right of chart when chart is not linked to
  // range data (click to link)
  unlinked: {
    name: 'link',
    size: 16,
  },

  // rotating spinner shown by the loading cell renderer
  groupLoading: {
    name: 'spinner-ios',
    size: 16,
  },

  // button to launch legacy column menu
  menu: {
    name: 'more-actions',
    size: 24,
  },

  // button to launch new enterprise column menu
  menuAlt: {
    name: 'more-actions',
    size: 24,
  },

  // menu tab icon in legacy tabbed enterprise column menu
  legacyMenu: {
    name: 'more-actions',
    size: 24,
  },

  // open filter button - header, floating filter, menu
  filter: {
    name: 'filter',
    size: 16,
  },

  // filter is applied - header (legacy column menu), filter tool panel
  filterActive: {
    name: 'filter',
    size: 16,
  },

  // filter tab icon in legacy tabbed enterprise column menu
  filterTab: {
    name: 'filter',
    size: 16,
  },

  // filter tool panel tab
  filtersToolPanel: {
    name: 'filter',
    size: 16,
  },

  // columns in menu (column chooser / columns tab)
  columns: {
    name: 'layout-column-three',
    size: 16,
  },

  // column tool panel tab
  columnsToolPanel: {
    name: 'layout-column-three',
    size: 16,
  },

  // button in chart regular size window title bar (click to maximise)
  maximize: {
    name: 'arrow-maximize',
    size: 16,
  },

  // button in chart maximised window title bar (click to make regular size)
  minimize: {
    name: 'arrow-minimize',
    size: 16,
  },

  // "Pin column" item in column header menu
  menuPin: {
    name: 'pin',
    size: 16,
  },

  // "Value aggregation" column menu item (shown on numeric
  // columns when grouping is active)"
  menuValue: {
    name: 'calculator',
    size: 16,
  },

  // "Group by {column-name}" item in column header menu
  menuAddRowGroup: {
    name: 'arrow-collapse-all',
    size: 16,
  },

  // "Un-Group by {column-name}" item in column header menu
  menuRemoveRowGroup: {
    name: 'arrow-collapse-all',
    size: 16,
  },

  // context menu copy item
  clipboardCopy: {
    name: 'copy',
    size: 16,
  },

  // context menu cut item
  clipboardCut: {
    name: 'cut',
    size: 16,
  },

  // context menu paste item
  clipboardPaste: {
    name: 'clipboard-arrow-right',
    size: 16,
  },

  // identifies the pivot drop zone
  pivotPanel: {
    name: 'pivot',
    size: 16,
  },

  // "Row groups" drop zone in column tool panel
  rowGroupPanel: {
    name: 'group',
    size: 20,
  },

  // columns tool panel Values drop zone
  valuePanel: {
    name: 'calculator',
    size: 16,
  },

  // drag handle used to pick up draggable columns
  columnDrag: {
    name: 're-order-dots-vertical',
    size: 16,
  },

  // drag handle used to pick up draggable rows
  rowDrag: {
    name: 'arrow-bidirectional-up-down',
    size: 16,
  },

  // context menu export item
  save: {
    name: 'arrow-download',
    size: 16,
  },

  // csv export
  csvExport: {
    name: 'document-text',
    size: 16,
  },

  // excel export
  excelExport: {
    name: 'document-xls',
    size: 16,
  },

  // icon on select dropdowns (select cell editor, charts tool panels)
  selectOpen: {
    name: 'chevron-down',
    size: 24,
  },

  // open icon for rich select editor
  richSelectOpen: {
    name: 'chevron-down',
    size: 24,
  },

  // remove for rich select editor pills
  richSelectRemove: {
    name: 'close',
    size: 24,
  },

  // icon for sub menu item
  subMenuOpen: {
    name: 'arrow-right',
    size: 16,
  },

  // version of subMenuOpen used in RTL mode
  subMenuOpenRtl: {
    name: 'arrow-left',
    size: 16,
  },

  // separator between column 'pills' when you add multiple
  // columns to the header drop zone
  panelDelimiter: {
    name: 'chevron-right',
    size: 16,
  },

  // version of panelDelimiter used in RTL mode
  panelDelimiterRtl: {
    name: 'arrow-left',
    size: 16,
  },

  // show on column header when column is sorted ascending
  sortAscending: {
    name: 'chevron-up',
    size: 24,
  },

  // show on column header when column is sorted descending
  sortDescending: {
    name: 'chevron-down',
    size: 24,
  },

  // show on column header when column has no sort, only when
  // enabled with colDef.unSortIcon=true
  sortUnSort: {
    name: 'subtract',
    size: 16,
  },

  // Builder button in Advanced Filter
  advancedFilterBuilder: {
    name: 'group',
    size: 20,
  },

  // drag handle used to pick up Advanced Filter Builder rows
  advancedFilterBuilderDrag: {
    name: 're-order-dots-vertical',
    size: 16,
  },

  // Advanced Filter Builder row validation error
  advancedFilterBuilderInvalid: {
    name: 'prohibited',
    size: 16,
  },

  // shown on Advanced Filter Builder rows to move them up
  advancedFilterBuilderMoveUp: {
    name: 'chevron-up',
    size: 24,
  },

  // shown on Advanced Filter Builder rows to move them down
  advancedFilterBuilderMoveDown: {
    name: 'chevron-down',
    size: 24,
  },

  // shown on Advanced Filter Builder rows to add new rows
  advancedFilterBuilderAdd: {
    name: 'add-circle',
    size: 24,
  },

  // shown on Advanced Filter Builder rows to remove row
  advancedFilterBuilderRemove: {
    name: 'subtract-circle',
    size: 16,
  },

  // shown on Advanced Filter Builder selection pills
  advancedFilterBuilderSelect: {
    name: 'chevron-down',
    size: 24,
  },

  // icon to open charts menu
  chartsMenu: {
    name: 'more-actions',
    size: 24,
  },

  // Edit Chart menu item shown in Integrated Charts menu
  chartsMenuEdit: {
    name: 'data-bar-vertical-ascending',
    size: 16,
  },

  // Advanced Settings menu item shown in Integrated Charts menu
  chartsMenuAdvancedSettings: {
    name: 'settings',
    size: 16,
  },

  // shown in Integrated Charts menu add fields
  chartsMenuAdd: {
    name: 'add',
    size: 24,
  },

  // shown in Integrated Charts tool panel color picker
  chartsColorPicker: {
    name: 'chevron-down',
    size: 24,
  },

  // previous in Integrated Charts settings tool panel theme switcher
  chartsThemePrevious: {
    name: 'chevron-left',
    size: 24,
  },

  // next in Integrated Charts settings tool panel theme switcher
  chartsThemeNext: {
    name: 'chevron-right',
    size: 24,
  },

  // download chart
  chartsDownload: {
    name: 'arrow-download',
    size: 16,
  },
};
export type IconMapType = typeof iconMap;
