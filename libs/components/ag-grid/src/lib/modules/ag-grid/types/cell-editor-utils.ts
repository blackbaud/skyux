import { ICellEditorParams, KeyCode } from 'ag-grid-community';

import { SkyAgGridCellEditorInitialAction } from './cell-editor-initial-action';

export class SkyAgGridCellEditorUtils {
  /**
   * Gets the initial action that a cell editor should take when initialized.
   * @param params The editor's initializing parameters.
   */
  public static getEditorInitialAction(
    params: ICellEditorParams | undefined,
  ): SkyAgGridCellEditorInitialAction {
    if (params?.cellStartedEdit) {
      if (
        params.eventKey === KeyCode.BACKSPACE ||
        params.eventKey === KeyCode.DELETE
      ) {
        return SkyAgGridCellEditorInitialAction.Delete;
      } else if (params.eventKey?.length === 1) {
        return SkyAgGridCellEditorInitialAction.Replace;
      } else {
        if (params.eventKey !== KeyCode.F2) {
          return SkyAgGridCellEditorInitialAction.Highlighted;
        } else {
          return SkyAgGridCellEditorInitialAction.Untouched;
        }
      }
    } else {
      return SkyAgGridCellEditorInitialAction.Untouched;
    }
  }

  /**
   * Returns the difference between the minuend and subtrahend, or 0 if the minuend is not defined.
   */
  public static subtractOrZero(
    minuend: number | null | undefined,
    subtrahend: number,
  ): number {
    // Swapping minuend with subtrahend when minuend is null or undefined results in
    // the subtrahend being subtracted from itself, which will always be 0.
    return (minuend ?? subtrahend) - subtrahend;
  }
}
