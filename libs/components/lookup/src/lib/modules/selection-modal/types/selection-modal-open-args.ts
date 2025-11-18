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
   * @deprecated Use the `selectionDescriptor` input to give context to the title and accessibility labels instead.
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
    args: SkySelectionModalSearchArgs,
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
   * The CSS class, such as `ag-custom-component-popup`, to add to the modal
   * that you open from a cell in the data entry grid.
   */
  wrapperClass?: string;

  /**
   * A descriptor for the item or items being selected. Use a plural term when `selectMode` is set to `multiple`; otherwise, use a singular term. The descriptor helps set the selection modal's `aria-label` attributes for the multiselect toolbar controls, the search input, and the save button to provide text equivalents for screen readers [to support accessibility](https://developer.blackbaud.com/skyux/components/checkbox#accessibility).
   * For example, when the descriptor is "constituents," the search input's `aria-label` is "Search constituents." For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   * @default "item"/"items"
   */
  selectionDescriptor?: string;
}
