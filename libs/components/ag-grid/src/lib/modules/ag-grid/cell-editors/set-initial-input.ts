import { ICellEditorParams, KeyCode } from 'ag-grid-community';

import { SkyInitialValueInfo } from '../types/initial-value-info';

export function getInitialValue(
  params: ICellEditorParams,
  valueFn: Function
): SkyInitialValueInfo {
  const valueInfo = {
    value: undefined,
    highlight: false,
  };
  if (params.cellStartedEdit) {
    if (
      params.keyPress === KeyCode.BACKSPACE ||
      params.keyPress === KeyCode.DELETE
    ) {
      valueInfo.value = '';
    } else if (params.charPress) {
      valueInfo.value = params.charPress;
    } else {
      valueInfo.value = valueFn(params);

      if (params.keyPress !== KeyCode.F2) {
        valueInfo.highlight = true;
      }
    }
  } else {
    valueInfo.value = valueFn(params);
  }

  return valueInfo;
}
