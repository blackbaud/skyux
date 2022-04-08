import { ICellRendererParams } from 'ag-grid-community';

import { SkyAgGridLookupProperties } from './lookup-properties';

/**
 * @internal
 */
export interface SkyCellRendererLookupParams extends ICellRendererParams {
  skyComponentProperties?: SkyAgGridLookupProperties;
}
