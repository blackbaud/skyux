/* istanbul ignore file */

/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-data-manager' schematic.
 * To update this file, simply rerun the command.
 */
import { NgModule } from '@angular/core';
import {
  SKY_LIB_RESOURCES_PROVIDERS,
  SkyAppLocaleInfo,
  SkyI18nModule,
  SkyLibResources,
  SkyLibResourcesProvider,
  SkyLibResourcesService,
  getLibStringForLocale,
} from '@skyux/i18n';

const RESOURCES: { [locale: string]: SkyLibResources } = {
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
    skyux_data_manager_status_update: {
      message:
        '{0} of {1} meet the search and filter criteria, and {2} are displayed. {3} items are selected.',
    },
    skyux_data_manager_status_update_only_selected: {
      message:
        '{0} of {1} items meet the search and filter criteria, and {2} of {3} selected items are displayed. Unselected items are not displayed.',
    },
  },
};

SkyLibResourcesService.addResources(RESOURCES);

export class SkyDataManagerResourcesProvider
  implements SkyLibResourcesProvider
{
  public getString(
    localeInfo: SkyAppLocaleInfo,
    name: string,
  ): string | undefined {
    return getLibStringForLocale(RESOURCES, localeInfo.locale, name);
  }
}

/**
 * Import into any component library module that needs to use resource strings.
 */
@NgModule({
  exports: [SkyI18nModule],
  providers: [
    {
      provide: SKY_LIB_RESOURCES_PROVIDERS,
      useClass: SkyDataManagerResourcesProvider,
      multi: true,
    },
  ],
})
export class SkyDataManagerResourcesModule {}
