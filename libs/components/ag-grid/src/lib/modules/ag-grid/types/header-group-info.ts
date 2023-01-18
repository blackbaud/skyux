import { Injectable } from '@angular/core';

import { ColumnGroup } from 'ag-grid-community';

/**
 * To display a help button beside the column group header, create a component that includes the help button element,
 * such as `sky-help-inline`, include a `SkyAgGridHeaderGroupInfo` parameter in the constructor to access the column
 * group information, such as display name, and add the component to the `headerComponentParams.inlineHelpComponent`
 * property of the column definition.
 */
@Injectable()
export class SkyAgGridHeaderGroupInfo {
  columnGroup: ColumnGroup | undefined;
  displayName: string | undefined;
  /**
   * Application context as set on `gridOptions.context`.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any;
}
