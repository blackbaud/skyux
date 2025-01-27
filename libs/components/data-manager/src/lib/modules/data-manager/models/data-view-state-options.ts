import { SkyDataViewColumnWidths } from './data-view-column-widths';

/**
 * @tags data-manager
 */
export interface SkyDataViewStateOptions {
  /**
   * The ID of this view.
   */
  viewId: string;
  /**
   * The IDs of the columns able to be displayed for column-based views. This property is required when utilizing a grid-based view, a column picker, or both.
   */
  columnIds?: string[];

  /**
   * The widths of columns in column-based views for xs and sm+ breakpoints. If using sticky settings, the widths a user sets will be persisted.
   */
  columnWidths?: SkyDataViewColumnWidths;

  /**
   * The IDs of the columns displayed for column-based views.
   */
  displayedColumnIds?: string[];
  /**
   * An untyped property that tracks any view-specific state information
   * that is relevant to a data manager but that existing properties do not cover.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalData?: any;
}
