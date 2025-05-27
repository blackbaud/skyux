import type { ICellEditorParams } from 'ag-grid-community';

import type { SkyAgGridLookupProperties } from './lookup-properties';

export interface SkyCellEditorLookupParams extends ICellEditorParams {
  skyComponentProperties?: SkyAgGridLookupProperties;
}
