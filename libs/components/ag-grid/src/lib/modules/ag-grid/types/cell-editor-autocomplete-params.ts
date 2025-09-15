import { ICellEditorParams } from 'ag-grid-community';

import {
  SkyAgGridAutocompleteProperties,
  SkyAutocompleteProperties,
} from './autocomplete-properties';

export interface SkyCellEditorAutocompleteParams extends ICellEditorParams {
  /**
   * The parameters provided to the autocomplete component.
   */
  skyComponentProperties?:
    | SkyAutocompleteProperties
    | SkyAgGridAutocompleteProperties;
}
