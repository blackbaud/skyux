import { Signal } from '@angular/core';

import { SkyDataColumnOption } from './data-column-option';

/**
 * Implemented by column-based components, such as a data grid, so that column
 * picker UIs can discover the available columns and control which columns
 * display without depending on the component itself.
 * @preview
 */
export abstract class SkyDataColumnSource {
  /**
   * The columns the component can display, in declaration order.
   */
  public abstract readonly dataColumns: Signal<readonly SkyDataColumnOption[]>;

  /**
   * The IDs of the columns that currently display, in display order. This
   * always reflects what the component displays, including its own default
   * before any columns have been set.
   */
  public abstract readonly displayedColumnIds: Signal<readonly string[]>;

  /**
   * Sets the columns that display and their order.
   */
  public abstract setDisplayedColumnIds(columnIds: string[]): void;
}
