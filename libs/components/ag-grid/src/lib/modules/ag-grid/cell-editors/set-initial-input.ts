import { ICellEditorParams, KeyCode } from 'ag-grid-community';

import { SkyInitialValueInfo } from '../types/initial-value-info';

export function getInitialValue(
  params: ICellEditorParams,
  valueFn: Function
): SkyInitialValueInfo {
  let valueInfo = {
    value: undefined,
    highlight: false,
  };
  if (params.cellStartedEdit) {
    if (
      params.eventKey === KeyCode.BACKSPACE ||
      params.eventKey === KeyCode.DELETE
    ) {
      valueInfo.value = '';
    } else if (params.charPress) {
      valueInfo.value = params.charPress;
    } else {
      valueInfo.value = valueFn(params);

      if (params.eventKey !== KeyCode.F2) {
        valueInfo.highlight = true;
      }
    }
  } else {
    valueInfo.value = valueFn(params);
  }

  return valueInfo;
}
