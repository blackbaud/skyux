import { SkyFilterBarFilterValue } from './filter-bar-filter-value';

/**
 * The context object that is provided to a filter modal.
 */
export class SkyFilterBarFilterModalContext {
  /**
   * The name of the filter. We recommend using this value for the modal's heading.
   */
  public filterLabelText: string;
  /**
   * The value of the filter.
   */
  public filterValue?: SkyFilterBarFilterValue;
  /**
   * An untyped property that can track any config information relevant to the filter modal
   * that existing options do not include.
   */
  public additionalContext?: Record<string, unknown>;

  constructor(args: {
    filterLabelText: string;
    filterValue?: SkyFilterBarFilterValue;
    additionalContext?: Record<string, unknown>;
  }) {
    this.filterLabelText = args.filterLabelText;
    this.filterValue = args.filterValue;
    this.additionalContext = args.additionalContext;
  }
}
