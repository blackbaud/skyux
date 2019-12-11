import {
  SkyGridSelectedRowsSource
} from './grid-selected-rows-source';

export interface SkyGridSelectedRowsModelChange {
  selectedRowIds?: string[];

  /**
   * @internal
   * Defines the source of the change. This will typically be used to determine
   * if the change came from user interaction or a programmatic source.
   */
  source?: SkyGridSelectedRowsSource;
}
