/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-pages' schematic.
 * To update this file, simply rerun the command.
 */
import { NgModule } from '@angular/core';
import {
  SKY_LIB_RESOURCES_PROVIDERS,
  SkyAppLocaleInfo,
  SkyI18nModule,
  SkyLibResources,
  SkyLibResourcesProvider,
  getLibStringForLocale,
} from '@skyux/i18n';

const RESOURCES: { [locale: string]: SkyLibResources } = {
  'EN-US': {
    sky_action_hub_related_links: { message: 'Related Links' },
    sky_action_hub_recent_links: { message: 'Recently Accessed' },
    sky_action_hub_settings_links: { message: 'Settings' },
    sky_action_hub_needs_attention: { message: 'Needs Attention' },
    sky_action_hub_needs_attention_empty: {
      message: 'No issues currently need attention',
    },
  },
};

export class SkyPagesResourcesProvider implements SkyLibResourcesProvider {
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
      useClass: SkyPagesResourcesProvider,
      multi: true,
    },
  ],
})
export class SkyPagesResourcesModule {}
