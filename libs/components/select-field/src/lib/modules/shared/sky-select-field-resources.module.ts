/* istanbul ignore file */

/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-select-field' schematic.
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
    skyux_select_field_add_new_record_button: { message: 'New' },
    skyux_select_field_multiple_select_open_button: {
      message: 'Select values',
    },
    skyux_select_field_multiple_select_picker_heading: {
      message: 'Select values',
    },
    skyux_select_field_multiple_select_summary: {
      message: '{0} items selected',
    },
    skyux_select_field_single_select_placeholder: { message: 'Select a value' },
    skyux_select_field_single_select_picker_heading: {
      message: 'Select a value',
    },
    skyux_select_field_single_select_open_button_title: {
      message: 'Click to select a value',
    },
    skyux_select_field_single_select_clear_button_title: {
      message: 'Clear selection',
    },
    skyux_select_field_picker_close_button: { message: 'Cancel' },
    skyux_select_field_picker_save_button: { message: 'Select' },
    skyux_select_field_picker_show_all_category: { message: 'Show all' },
  },
};

SkyLibResourcesService.addResources(RESOURCES);

export class SkySelectFieldResourcesProvider
  implements SkyLibResourcesProvider
{
  public getString(
    localeInfo: SkyAppLocaleInfo,
    name: string
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
      useClass: SkySelectFieldResourcesProvider,
      multi: true,
    },
  ],
})
export class SkySelectFieldResourcesModule {}
