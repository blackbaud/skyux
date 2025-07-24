import { SkyFilterBarFilterValue } from './filter-bar-filter-value';

/**
 * The context object that is provided to a filter modal.
 */
export class SkyFilterBarFilterModalContext {
  /**
   * The name of the filter for displaying in the modal title.
   */
  public filterName: string;
  /**
   * The value of the filter.
   */
  public filterValue?: SkyFilterBarFilterValue;
  /**
   * An untyped property that can track any config information relevant to the filter modal
   * that existing options do not include.
   */
  public additionalContext?: Record<string, unknown>;

  constructor(
    filterName: string,
    filterValue?: SkyFilterBarFilterValue,
    additionalContext?: Record<string, unknown>,
  ) {
    this.filterName = filterName;
    this.filterValue = filterValue;
    this.additionalContext = additionalContext;
  }
}
