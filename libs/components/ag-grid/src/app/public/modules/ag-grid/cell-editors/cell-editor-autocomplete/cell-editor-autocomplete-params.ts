import {
  ICellEditorParams
} from 'ag-grid-community';

import {
  SkyAutocompleteProperties
} from './autocomplete-properties';

export interface SkyCellEditorAutocompleteParams extends ICellEditorParams {
  skyComponentProperties?: SkyAutocompleteProperties;
}
