import { SkyFilterBarFilterValue } from './filter-bar-filter-value';

/**
 * The context object that is provided to a filter modal.
 * @typeParam TValue - The type of the filter value. Defaults to `unknown` for backward compatibility.
 * @typeParam TData - The type of the additional context data. Defaults to `Record<string, unknown>`.
 */
export class SkyFilterItemModalContext<
  TValue = unknown,
  TData = Record<string, unknown>,
> {
  /**
   * The name of the filter. We recommend using this value for the modal's heading.
   */
  public readonly filterLabelText: string;
  /**
   * The value of the filter.
   */
  public readonly filterValue?: SkyFilterBarFilterValue<TValue>;
  /**
   * An untyped property that can track any config information relevant to the filter modal
   * that existing options do not include.
   */
  public readonly additionalContext?: TData;

  constructor(args: {
    filterLabelText: string;
    filterValue?: SkyFilterBarFilterValue<TValue>;
    additionalContext?: TData;
  }) {
    this.filterLabelText = args.filterLabelText;
    this.filterValue = args.filterValue;
    this.additionalContext = args.additionalContext;
  }
}
