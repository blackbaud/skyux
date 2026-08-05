import { GridOptions } from 'ag-grid-community';

/**
 * Grid options every ag-grid fixture applies so Karma specs render
 * deterministically: no virtualization, scrollbars always present.
 */
export const AG_GRID_FIXTURE_TEST_OPTIONS: Partial<GridOptions> = {
  alwaysShowHorizontalScroll: true,
  alwaysShowVerticalScroll: true,
  suppressColumnVirtualisation: true,
  suppressRowVirtualisation: true,
};
