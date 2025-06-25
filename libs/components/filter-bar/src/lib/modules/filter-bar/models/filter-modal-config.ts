import { SkyFilterBarFilterValue } from './filter-bar-filter-value';

export interface SkyFilterBarFilterModalConfig {
  modalComponent: unknown;

  modalSize?: 'small' | 'medium' | 'large' | 'full';

  additionalContext?: Record<string, unknown>;
}

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
