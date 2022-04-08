import { ICellRendererParams } from 'ag-grid-community';

import { SkyLookupProperties } from './lookup-properties';

/**
 * @internal
 */
export interface SkyCellRendererLookupParams extends ICellRendererParams {
  skyComponentProperties?: SkyLookupProperties;
}
