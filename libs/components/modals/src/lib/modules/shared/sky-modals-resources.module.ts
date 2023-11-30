/* istanbul ignore file */

/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-modals' schematic.
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
    skyux_confirm_dialog_default_ok_text: { message: 'OK' },
    skyux_confirm_dialog_default_yes_text: { message: 'Yes' },
    skyux_confirm_dialog_default_no_text: { message: 'No' },
    skyux_confirm_dialog_default_cancel_text: { message: 'Cancel' },
    skyux_modal_close: { message: 'Close modal' },
    skyux_modal_open_help: { message: 'Open Help' },
    skyux_modal_footer_cancel_button: { message: 'Cancel' },
    skyux_modal_footer_primary_button: { message: 'Save' },
    skyux_modal_dirty_default_message: {
      message: 'Are you sure you want to discard your changes?',
    },
    skyux_modal_dirty_default_discard_changes_text: {
      message: 'Discard changes',
    },
    skyux_modal_dirty_default_keep_working_text: { message: 'Keep working' },
  },
};

SkyLibResourcesService.addResources(RESOURCES);

export class SkyModalsResourcesProvider implements SkyLibResourcesProvider {
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
      useClass: SkyModalsResourcesProvider,
      multi: true,
    },
  ],
})
export class SkyModalsResourcesModule {}
