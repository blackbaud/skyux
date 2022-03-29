import { ICellEditorParams } from '@ag-grid-community/core';

import { SkyAutocompleteProperties } from './autocomplete-properties';

export interface SkyCellEditorAutocompleteParams extends ICellEditorParams {
  skyComponentProperties?: SkyAutocompleteProperties;
}
