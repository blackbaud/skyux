import { ICellEditorParams } from 'ag-grid-community';

import {
  SkyAgGridAutocompleteProperties,
  SkyAutocompleteProperties,
} from './autocomplete-properties';

export interface SkyCellEditorAutocompleteParams extends ICellEditorParams {
  skyComponentProperties?:
    | SkyAutocompleteProperties
    | SkyAgGridAutocompleteProperties;
}
