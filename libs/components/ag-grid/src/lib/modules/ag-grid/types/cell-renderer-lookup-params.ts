import { ICellRendererParams } from '@ag-grid-community/core';

import { SkyAgGridLookupProperties } from './lookup-properties';

/**
 * @internal
 */
export interface SkyCellRendererLookupParams extends ICellRendererParams {
  skyComponentProperties?: SkyAgGridLookupProperties;
}
