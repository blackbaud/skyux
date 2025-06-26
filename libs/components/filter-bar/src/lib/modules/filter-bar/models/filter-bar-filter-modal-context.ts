import { SkyFilterBarFilterValue } from './filter-bar-filter-value';

export class SkyFilterBarFilterModalContext {
  public filterValue?: SkyFilterBarFilterValue;

  public additionalContext?: Record<string, unknown>;

  constructor(
    filterValue?: SkyFilterBarFilterValue,
    additionalContext?: Record<string, unknown>,
  ) {
    this.filterValue = filterValue;
    this.additionalContext = additionalContext;
  }
}
