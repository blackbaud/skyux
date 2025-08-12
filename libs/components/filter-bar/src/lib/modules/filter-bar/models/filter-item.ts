import { Signal, TemplateRef } from '@angular/core';

import { SkyFilterBarFilterValue } from './filter-bar-filter-value';

export interface SkyFilterItem {
  filterId: Signal<string>;
  labelText: Signal<string>;
  filterValue: Signal<SkyFilterBarFilterValue | undefined>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateRef: Signal<TemplateRef<any> | undefined>;
}
