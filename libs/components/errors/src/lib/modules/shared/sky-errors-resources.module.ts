/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-errors' schematic.
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
    skyux_errors_broken_description: {
      message: 'Something went wrong.\nTry again or come back later.',
    },
    skyux_errors_broken_title: { message: "That's odd..." },
    skyux_errors_construction_description: {
      message: 'We appreciate your patience while we\nmake improvements.',
    },
    skyux_errors_construction_title: { message: 'Work in progress.' },
    skyux_errors_not_found_description: {
      message: 'Pardon us, but this page\nis missing or has moved.',
    },
    skyux_errors_not_found_title: { message: 'Nothing to see here.' },
    skyux_errors_security_description: {
      message: 'Ask your administrator for access.',
    },
    skyux_errors_security_title: {
      message: "Heads up!\nYou're in a restricted area.",
    },
  },
};

export class SkyErrorsResourcesProvider implements SkyLibResourcesProvider {
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
      useClass: SkyErrorsResourcesProvider,
      multi: true,
    },
  ],
})
export class SkyErrorsResourcesModule {}
