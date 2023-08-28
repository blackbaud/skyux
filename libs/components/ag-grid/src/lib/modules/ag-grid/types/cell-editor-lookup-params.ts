import { ICellEditorParams } from '@ag-grid-community/core';

import { SkyAgGridLookupProperties } from './lookup-properties';

/**
 * @internal
 */
export interface SkyCellEditorLookupParams extends ICellEditorParams {
  skyComponentProperties?: SkyAgGridLookupProperties;
}
