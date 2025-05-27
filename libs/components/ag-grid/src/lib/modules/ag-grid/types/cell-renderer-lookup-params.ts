import type { ICellRendererParams } from 'ag-grid-community';

import type { SkyAgGridLookupProperties } from './lookup-properties';

/**
 * @internal
 */
export interface SkyCellRendererLookupParams extends ICellRendererParams {
  skyComponentProperties?: SkyAgGridLookupProperties;
}
