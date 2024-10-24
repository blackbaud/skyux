import { BaseHarnessFilters } from '@angular/cdk/testing';

export interface SkyDateRangePickerCalculatorOptionHarnessFilters
  extends BaseHarnessFilters {
  text?: string;
  // add fiulter for caclualtor based on calaculator id enums - do conumser calculators later
  index?: number;
}
