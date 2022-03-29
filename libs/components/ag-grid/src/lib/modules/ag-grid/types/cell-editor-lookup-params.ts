import { ICellEditorParams } from '@ag-grid-community/core';

import { SkyLookupProperties } from './lookup-properties';

export interface SkyCellEditorLookupParams extends ICellEditorParams {
  skyComponentProperties?: SkyLookupProperties;
}
