import { InjectionToken } from '@angular/core';

import { SkyAgGridHeaderGroupInfo } from '../types/header-group-info';

/**
 * To display a help button beside the column group header, create a component that includes the help button element,
 * such as `sky-help-inline`, and include `@Inject(SkyAgGridHeader)` in the constructor to access the column information
 * such as display name, and add the component to the `headerComponentParams.inlineHelpComponent` property of the column
 * definition.
 */
export const SkyAgGridHeaderGroup =
  new InjectionToken<SkyAgGridHeaderGroupInfo>('SkyAgGridHeaderGroupInfo');
