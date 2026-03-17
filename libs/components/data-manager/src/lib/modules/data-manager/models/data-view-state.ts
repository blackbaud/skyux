import { SkyDataViewColumnWidths } from './data-view-column-widths';
import { SkyDataViewStateOptions } from './data-view-state-options';

/**
 * Provides options for defining how data is displayed, such as which columns appear.
 */
export class SkyDataViewState {
  /**
   * The IDs of the columns able to be displayed for column-based views. This property is required when utilizing a grid-based view, a column picker, or both.
   */
  public columnIds: string[] = [];

  /**
   * The widths of columns in column-based views for xs and sm+ breakpoints. If using sticky settings, the widths a user sets will be persisted.
   */
  public columnWidths: SkyDataViewColumnWidths = { xs: {}, sm: {} };
  /**
   * The IDs of the columns displayed for column-based views.
   */
  public displayedColumnIds: string[] = [];
  /**
   * The ID of this view.
   */
  public viewId: string;
  /**
   * An untyped property that tracks any view-specific state information
   * that is relevant to a data manager but that existing properties do not cover.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public additionalData: any;

  constructor(data: SkyDataViewStateOptions) {
    this.viewId = data.viewId;
    this.columnIds = data.columnIds || [];
    const widths = data.columnWidths ?? {};
    this.columnWidths = {
      xs: widths.xs ?? {},
      sm: widths.sm ?? {},
    };
    this.displayedColumnIds = data.displayedColumnIds || [];
    this.additionalData = data.additionalData;
  }

  private safeCloneAdditionalData(value: unknown): unknown {
    try {
      // Use structuredClone when available to avoid mutating the original value.
      // If cloning fails (e.g., for non-cloneable values), fall back to the original.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return structuredClone(value as any);
    } catch {
      return value;
    }
  }

  /**
   * Returns the `SkyDataViewStateOptions` for the current view.
   * @returns The `SkyDataViewStateOptions`.
   */
  public getViewStateOptions(): SkyDataViewStateOptions {
    return {
      viewId: this.viewId,
      columnIds: [...this.columnIds],
      columnWidths: {
        xs: { ...(this.columnWidths?.xs ?? {}) },
        sm: { ...(this.columnWidths?.sm ?? {}) },
      },
      displayedColumnIds: [...this.displayedColumnIds],
      additionalData:
        this.additionalData !== undefined
          ? this.safeCloneAdditionalData(this.additionalData)
          : undefined,
    };
  }
}
