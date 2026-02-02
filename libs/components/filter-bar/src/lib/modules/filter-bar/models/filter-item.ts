import { Signal, TemplateRef } from '@angular/core';

import { SkyFilterBarFilterValue } from './filter-bar-filter-value';

/**
 * Defines the common properties various filter item types must implement to work with the filter bar component.
 * @typeParam TValue - The type of the filter value. Defaults to `unknown` for backward compatibility.
 * @internal
 */
export interface SkyFilterItem<TValue = unknown> {
  /**
   * A unique identifier for the filter item.
   */
  filterId: Signal<string>;
  /**
   * The label for the filter item.
   */
  labelText: Signal<string>;
  /**
   * The template of the filter that is rendered by the filter bar.
   * @internal
   */
  templateRef: Signal<TemplateRef<unknown> | undefined>;
  /**
   * The value of the filter item.
   * @internal
   */
  filterValue: Signal<SkyFilterBarFilterValue<TValue> | undefined>;
}
