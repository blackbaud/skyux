import { Signal } from '@angular/core';

import { SkyDataColumnOption } from './data-column-option';

/**
 * Implemented by column-based components, such as a data grid, so that column
 * picker UIs can discover the available columns and control which columns
 * display without depending on the component itself.
 * @internal
 */
export abstract class SkyDataColumnSource {
  /**
   * The columns the component can display, in declaration order.
   */
  public abstract readonly columnOptions: Signal<
    readonly SkyDataColumnOption[]
  >;

  /**
   * The IDs of the columns the component displays, in display order. Before
   * any columns are set, these are the component's default columns.
   */
  public abstract readonly displayedColumnIds: Signal<readonly string[]>;

  /**
   * Sets the columns that display and their order.
   */
  public abstract setDisplayedColumnIds(columnIds: readonly string[]): void;
}
