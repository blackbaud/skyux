/* istanbul ignore file */

/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-phone-field' schematic.
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

const RESOURCES: Record<string, SkyLibResources> = {
  'EN-US': {
    skyux_phone_field_country_search_dismiss: {
      message: 'Dismiss country search',
    },
    skyux_phone_field_country_search_label: {
      message: 'Dismiss country search',
    },
    skyux_phone_field_country_search_placeholder: {
      message: 'Search for a country',
    },
    skyux_phone_field_country_select_label: { message: 'Choose country.' },
    skyux_phone_field_country_selected_label: {
      message: '{0} is currently selected.',
    },
    skyux_phone_field_format_hint_text: { message: 'Example: {0}.' },
  },
};

SkyLibResourcesService.addResources(RESOURCES);

export class SkyPhoneFieldResourcesProvider implements SkyLibResourcesProvider {
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
      useClass: SkyPhoneFieldResourcesProvider,
      multi: true,
    },
  ],
})
export class SkyPhoneFieldResourcesModule {}
