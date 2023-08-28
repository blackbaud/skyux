import { ICellEditorParams } from '@ag-grid-community/core';

import {
  SkyAgGridAutocompleteProperties,
  SkyAutocompleteProperties,
} from './autocomplete-properties';

/**
 * @internal
 */
export interface SkyCellEditorAutocompleteParams extends ICellEditorParams {
  skyComponentProperties?:
    | SkyAutocompleteProperties
    | SkyAgGridAutocompleteProperties;
}
