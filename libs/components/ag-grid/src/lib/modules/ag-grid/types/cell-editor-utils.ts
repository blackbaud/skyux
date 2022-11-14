import { ICellEditorParams, KeyCode } from 'ag-grid-community';

import { SkyAgGridCellEditorInitialAction } from './cell-editor-initial-action';

export class SkyAgGridCellEditorUtils {
  /**
   * Gets the intiial action that a cell editor should take when initialized.
   * @param params The editor's initializing parameters.
   */
  public static getEditorInitialAction(
    params: ICellEditorParams | undefined
  ): SkyAgGridCellEditorInitialAction {
    if (params?.cellStartedEdit) {
      if (
        params.eventKey === KeyCode.BACKSPACE ||
        params.eventKey === KeyCode.DELETE
      ) {
        return SkyAgGridCellEditorInitialAction.Delete;
      } else if (params.charPress) {
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
}
