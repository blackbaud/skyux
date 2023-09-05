/* istanbul ignore file */

/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-tiles' schematic.
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
    skyux_tile_expand: { message: 'Expand or collapse {0}' },
    skyux_tile_expand_default: { message: 'Expand or collapse' },
    skyux_tile_help: { message: '{0} help' },
    skyux_tile_help_default: { message: 'Help' },
    skyux_tile_settings: { message: '{0} settings' },
    skyux_tile_settings_default: { message: 'Settings' },
    skyux_tile_move: { message: 'Move {0}' },
    skyux_tile_move_default: { message: 'Move' },
    skyux_tile_move_instructions: {
      message:
        "When focus is placed on a tile's move button, use the arrow keys to move it. The up and down keys change its position within a column. The left and right keys move it between columns.",
    },
    skyux_tile_moved_assistive_text: {
      message:
        '{0} moved. Current column: {1} of {2}. Current position in column: {3} of {4}',
    },
  },
};

SkyLibResourcesService.addResources(RESOURCES);

export class SkyTilesResourcesProvider implements SkyLibResourcesProvider {
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
      useClass: SkyTilesResourcesProvider,
      multi: true,
    },
  ],
})
export class SkyTilesResourcesModule {}
