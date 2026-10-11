import { Signal } from '@angular/core';

import { SkyDataColumnOption } from './data-column-option';

/**
 * Implemented by column-based components, such as a data grid, so that column
 * picker UIs can discover the available columns and control which columns
 * display, so that a container can store the widths users give columns and
 * restore them later, and so that a container that keeps its own toolbar
 * visible while the page scrolls can keep the column headers visible beneath
 * it, without depending on the component itself.
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
   * The widths in pixels of the columns users resized, keyed by column ID.
   */
  public abstract readonly columnWidths: Signal<
    Readonly<Record<string, number>>
  >;

  /**
   * The IDs of the columns the component displays, in display order. Before
   * any columns are set, these are the component's default columns.
   */
  public abstract readonly displayedColumnIds: Signal<readonly string[]>;

  /**
   * The selectors of the elements, such as the column headers, that the
   * component keeps visible at the top of the viewport while the page scrolls.
   */
  public abstract readonly viewkeeperClasses: Signal<readonly string[]>;

  /**
   * Stops the component from keeping the `viewkeeperClasses` elements visible
   * itself, because a container keeps them visible instead.
   */
  public abstract disableViewkeeper(): void;

  /**
   * Sets the widths in pixels of columns, keyed by column ID. Columns that are
   * not included return to the widths they are declared with. Until this is
   * called, the component does not track the widths users give columns.
   */
  public abstract setColumnWidths(
    columnWidths: Readonly<Record<string, number>>,
  ): void;

  /**
   * Sets the columns that display and their order.
   */
  public abstract setDisplayedColumnIds(columnIds: readonly string[]): void;
}
