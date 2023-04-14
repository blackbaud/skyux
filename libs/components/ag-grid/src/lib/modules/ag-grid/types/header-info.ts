import { Injectable } from '@angular/core';

import { Column } from 'ag-grid-community';

/**
 * To display a help button beside the column header, create a component that includes the help button element,
 * such as `sky-help-inline`, include a `SkyAgGridHeaderInfo` parameter in the constructor to access the column
 * information, such as display name, and add the component to the `headerComponentParams.inlineHelpComponent` property
 * of the column definition.
 */
@Injectable()
export class SkyAgGridHeaderInfo {
  public column: Column | undefined;
  public displayName: string | undefined;
  /**
   * Application context as set on `gridOptions.context`.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public context: any;
}
