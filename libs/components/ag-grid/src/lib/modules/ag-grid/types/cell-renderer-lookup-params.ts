import { ICellRendererParams } from 'ag-grid-community';

import { SkyAgGridLookupProperties } from './lookup-properties';

/**
 * Parameters for the lookup cell renderer.
 */
export interface SkyCellRendererLookupParams extends ICellRendererParams {
  /**
   * The parameters provided to the lookup component.
   */
  skyComponentProperties?: SkyAgGridLookupProperties;
}
