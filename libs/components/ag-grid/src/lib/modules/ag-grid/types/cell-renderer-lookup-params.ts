import { ICellRendererParams } from '@ag-grid-community/core';

import { SkyLookupProperties } from './lookup-properties';

export interface SkyCellRendererLookupParams extends ICellRendererParams {
  skyComponentProperties?: SkyLookupProperties;
}
