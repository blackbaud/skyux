import type { ICellEditorParams } from 'ag-grid-community';

import type {
  SkyAgGridAutocompleteProperties,
  SkyAutocompleteProperties,
} from './autocomplete-properties';

export interface SkyCellEditorAutocompleteParams extends ICellEditorParams {
  skyComponentProperties?:
    | SkyAutocompleteProperties
    | SkyAgGridAutocompleteProperties;
}
