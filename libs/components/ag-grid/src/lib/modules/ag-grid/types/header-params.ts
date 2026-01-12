import { TemplateRef, Type } from '@angular/core';

import { IHeaderParams } from 'ag-grid-community';

/**
 * Interface to use for the
 * [`headerComponentParams`](https://www.ag-grid.com/angular-data-grid/column-properties/#reference-header-headerComponentParams)
 * property on `ColDef`.
 */
export interface SkyAgGridHeaderParams extends IHeaderParams {
  /**
   * Hides the column header text.
   * Each column should have a `headerName` defined in the column definition for accessibility.
   * This option allows that text to be hidden from view while still being available to screen readers.
   */
  headerHidden?: boolean;

  /**
   * The component to display as inline help beside the column header.
   * @see SkyAgGridHeaderInfo
   */
  inlineHelpComponent?: Type<unknown>;

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   */
  helpPopoverTitle?: string | undefined;

  /**
   * The content of the help popover. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the column heading. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title.
   */
  helpPopoverContent?: string | TemplateRef<unknown> | undefined;
}
