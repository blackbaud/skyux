import { SkyFilterBarFilterValue } from './filter-bar-filter-value';

export class SkyFilterBarFilterModalContext {
  public filterName: string;

  public filterValue?: SkyFilterBarFilterValue;

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
