import { Signal } from '@angular/core';

/**
 * Implemented by components that let users select rows, such as a data grid,
 * so that a container can store the selection and restore it later, without
 * depending on the component itself.
 * @internal
 */
export abstract class SkyDataSelectionSource {
  /**
   * Whether users can select multiple rows.
   */
  public abstract readonly multiselect: Signal<boolean>;

  /**
   * The IDs of the selected rows.
   */
  public abstract readonly selectedRowIds: Signal<readonly string[]>;

  /**
   * Stops the component from removing the IDs of rows that are not in its data
   * from `selectedRowIds`, because a container keeps those rows selected
   * instead, such as rows its search or filters hide.
   */
  public abstract disableSelectionPruning(): void;

  /**
   * Sets the selected rows.
   */
  public abstract setSelectedRowIds(selectedRowIds: readonly string[]): void;
}
