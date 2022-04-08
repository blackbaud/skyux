import { ICellEditorParams } from 'ag-grid-community';

import { SkyAgGridLookupProperties } from './lookup-properties';

/**
 * @internal
 */
export interface SkyCellEditorLookupParams extends ICellEditorParams {
  skyComponentProperties?: SkyAgGridLookupProperties;
}
