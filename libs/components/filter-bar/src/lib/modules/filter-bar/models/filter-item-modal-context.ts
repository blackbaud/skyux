import { SkyFilterBarFilterValue } from './filter-bar-filter-value';

/**
 * The context object that is provided to a filter modal.
 * @typeParam TData - The type of the additional context data. Defaults to `Record<string, unknown>`.
 */
export class SkyFilterItemModalContext<TData = Record<string, unknown>> {
  /**
   * The name of the filter. We recommend using this value for the modal's heading.
   */
  public readonly filterLabelText: string;
  /**
   * The value of the filter.
   */
  public readonly filterValue?: SkyFilterBarFilterValue;
  /**
   * An untyped property that can track any config information relevant to the filter modal
   * that existing options do not include.
   */
  public readonly additionalContext?: TData;

  constructor(args: {
    filterLabelText: string;
    filterValue?: SkyFilterBarFilterValue;
    additionalContext?: TData;
  }) {
    this.filterLabelText = args.filterLabelText;
    this.filterValue = args.filterValue;
    this.additionalContext = args.additionalContext;
  }
}
