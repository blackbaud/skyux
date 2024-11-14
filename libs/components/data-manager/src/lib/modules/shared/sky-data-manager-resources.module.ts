/* istanbul ignore file */

/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-data-manager' schematic.
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
    skyux_data_manager_column_picker_title: {
      message: 'Choose columns to show in the list',
    },
    skyux_data_manager_apply_changes_button_title: { message: 'Apply changes' },
    skyux_data_manager_cancel_button_title: { message: 'Cancel' },
    skyux_data_manager_select_all_button_aria_label: {
      message: 'Select all {0}',
    },
    skyux_data_manager_select_all_button_title: { message: 'Select all' },
    skyux_data_manager_clear_all_button_aria_label: {
      message: 'Clear all selected {0}',
    },
    skyux_data_manager_clear_all_button_title: { message: 'Clear all' },
    skyux_data_manager_show_selected_option_aria_label: {
      message: 'Show only selected {0}',
    },
    skyux_data_manager_show_selected_option_title: {
      message: 'Show only selected items',
    },
    skyux_data_manager_columns_button_aria_label: {
      message: 'Choose columns for {0}',
    },
    skyux_data_manager_columns_button_title: { message: 'Columns' },
    skyux_data_manager_select_column_status_indicator_title: {
      message: 'Select at least one column.',
    },
    skyux_data_manager_status_update_with_selections: {
      message: '{0} of {1} items meet criteria and {2} selected.',
    },
    skyux_data_manager_status_update_without_selections: {
      message: '{0} of {1} items meet criteria.',
    },
    skyux_data_manager_status_update_only_selected: {
      message:
        '{0} of {1} items meet criteria and {2} selected. Only selected items are displayed.',
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
export class SkyDataManagerResourcesModule {}
