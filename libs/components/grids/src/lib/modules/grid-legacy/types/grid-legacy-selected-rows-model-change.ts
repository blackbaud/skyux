import { SkyGridLegacySelectedRowsSource } from './grid-legacy-selected-rows-source';

/**
 * @deprecated `SkyGridLegacyComponent` and its features are deprecated. We recommend using the data grid instead. For more information, see https://developer.blackbaud.com/skyux/components/data-grid
 */
export interface SkyGridLegacySelectedRowsModelChange {
  /**
   * The IDs of the rows that are selected.
   */
  selectedRowIds?: string[];

  /**
   * @internal
   * Defines the source of the change. This will typically be used to determine
   * if the change came from user interaction or a programmatic source.
   */
  source?: SkyGridLegacySelectedRowsSource;
}
