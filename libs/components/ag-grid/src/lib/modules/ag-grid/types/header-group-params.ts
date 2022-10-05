import { ComponentType } from '@angular/cdk/portal';

import { IHeaderGroupParams } from 'ag-grid-community';

export interface SkyAgGridHeaderGroupParams extends IHeaderGroupParams {
  inlineHelpComponent?: ComponentType<unknown>;
}
