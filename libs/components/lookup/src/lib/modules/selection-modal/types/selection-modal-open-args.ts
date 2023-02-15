import { TemplateRef } from '@angular/core';

import { Observable } from 'rxjs';

import { SkyLookupSelectModeType } from '../../lookup/types/lookup-select-mode-type';

import { SkySelectionModalAddClickEventArgs } from './selection-modal-add-click-event-args';
import { SkySelectionModalSearchArgs } from './selection-modal-search-args';
import { SkySelectionModalSearchResult } from './selection-modal-search-result';

/**
 * Parameters for the selection modal.
 */
export interface SkySelectionModalOpenArgs {
  /**
   * The template to format each option in the search results. The selection modal
   * injects values into the template as `item` variables that reference all the object
   * properties of the options. If you do not specify a template, the item's descriptor
   * property value is displayed.
   */
  itemTemplate?: TemplateRef<unknown>;

  /**
   * The title for the selection modal.
   * @default "Select an option/Select options"
   */
  title?: string;

  /**
   * The initial value for the selection modal.
   */
  value?: unknown[];

  /**
   * Specifies an object property to display in the text input after users
   * select an item in the dropdown list.
   */
  descriptorProperty: string;

  /**
   * An object property that represents the object's unique identifier.
   */
  idProperty: string;

  /**
   * The initial search text.
   */
  initialSearch?: string;

  /**
   * Called when users enter new search information and returns results via an observable.
   */
  searchAsync: (
    args: SkySelectionModalSearchArgs
  ) => Observable<SkySelectionModalSearchResult> | undefined;

  /**
   * Specifies whether users can select one option or multiple options.
   * @default "multiple"
   */
  selectMode: SkyLookupSelectModeType;

  /**
   * Whether to display a button that lets users add options to the list.
   * @default false
   */
  showAddButton?: boolean;

  /**
   * Called when users select the button to add options to the list.
   */
  addClick?: (args: SkySelectionModalAddClickEventArgs) => void;

  /**
   * The CSS class to add to the modal, such as `ag-custom-component-popup` for
   * using a modal as part of a cell editor in Data Entry Grid.
   */
  wrapperClass?: string;
}
