import { ICellEditorParams } from 'ag-grid-community';

import { SkyAutocompleteProperties } from './autocomplete-properties';

/**
 * @internal
 */
export interface SkyCellEditorAutocompleteParams extends ICellEditorParams {
  skyComponentProperties?: SkyAutocompleteProperties;
}
