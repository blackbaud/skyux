/* istanbul ignore file */
/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-ag-grid' schematic.
 * To update this file, simply rerun the command.
 */
import { NgModule } from '@angular/core';
import {
  SkyI18nModule,
  SkyLibResources,
  SkyLibResourcesService,
} from '@skyux/i18n';

const RESOURCES: Record<string, SkyLibResources> = {
  'EN-US': {
    sky_ag_grid_row_selector_aria_label: {
      message: 'Row selector for row {0}',
    },
    sky_ag_grid_row_selector_column_heading: { message: 'Row selection' },
    sky_ag_grid_cell_editor_datepicker_aria_label: {
      message: 'Editable date {0} for row {1}',
    },
    sky_ag_grid_cell_editor_datepicker_hint_text: {
      message: 'Use the format {0}.',
    },
    sky_ag_grid_cell_editor_number_aria_label: {
      message: 'Editable number {0} for row {1}',
    },
    sky_ag_grid_cell_editor_text_aria_label: {
      message: 'Editable text {0} for row {1}',
    },
    sky_ag_grid_cell_editor_autocomplete_aria_label: {
      message: 'Editable autocomplete {0} for row {1}',
    },
    sky_ag_grid_cell_renderer_number_validator_message: {
      message: 'Enter a valid number.',
    },
    sky_ag_grid_cell_renderer_currency_validator_message: {
      message: 'Enter a valid currency.',
    },
    skyux_lookup_tokens_summary: { message: '{0} items selected' },
    sky_ag_grid_cell_editor_currency_aria_label: {
      message: 'Editable currency {0} for row {1}',
    },
    sky_ag_grid_column_header_sort_button_aria_label_currently_asc: {
      message: 'Sort column {0}, currently ascending',
    },
    sky_ag_grid_column_header_sort_button_aria_label_currently_desc: {
      message: 'Sort column {0}, currently descending',
    },
    sky_ag_grid_column_header_sort_button_aria_label_currently_not_sorted: {
      message: 'Sort column {0}, not currently sorted',
    },
    sky_ag_grid_column_group_header_expand_aria_label: {
      message: 'Expand column group {0}',
    },
    sky_ag_grid_column_group_header_collapse_aria_label: {
      message: 'Collapse column group {0}',
    },
  },
};

SkyLibResourcesService.addResources(RESOURCES);

/**
 * Import into any component library module that needs to use resource strings.
 */
@NgModule({
  exports: [SkyI18nModule],
})
export class SkyAgGridResourcesModule {}
