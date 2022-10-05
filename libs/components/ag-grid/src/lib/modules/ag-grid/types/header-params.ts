import { ComponentType } from '@angular/cdk/portal';

import { IHeaderParams } from 'ag-grid-community/dist/lib/headerRendering/cells/column/headerComp';

export interface SkyAgGridHeaderParams extends IHeaderParams {
  inlineHelpComponent?: ComponentType<unknown>;
}
