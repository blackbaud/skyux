/* istanbul ignore file */

/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-angular-tree-component' schematic.
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
    skyux_angular_tree_clear_all: { message: 'Clear all' },
    skyux_angular_tree_click_to_expand: { message: 'Click to expand' },
    skyux_angular_tree_collapse_all: { message: 'Collapse' },
    skyux_angular_tree_expand_all: { message: 'Expand' },
    skyux_angular_tree_select_all: { message: 'Select all' },
  },
};

SkyLibResourcesService.addResources(RESOURCES);

export class SkyAngularTreeComponentResourcesProvider
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
      useClass: SkyAngularTreeComponentResourcesProvider,
      multi: true,
    },
  ],
})
export class SkyAngularTreeComponentResourcesModule {}
