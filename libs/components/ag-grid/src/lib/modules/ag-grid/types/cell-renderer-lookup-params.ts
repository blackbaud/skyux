import { ICellRendererParams } from 'ag-grid-community';

import { SkyLookupProperties } from './lookup-properties';

export interface SkyCellRendererLookupParams extends ICellRendererParams {
  skyComponentProperties?: SkyLookupProperties;
}
