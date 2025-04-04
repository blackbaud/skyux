/* istanbul ignore file */
/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-action-bars' schematic.
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
    skyux_summary_action_bar_open_secondary: {
      message: 'Show secondary actions',
    },
    skyux_summary_action_bar_expand: { message: 'Expand or collapse summary' },
  },
  'FR-CA': {
    skyux_summary_action_bar_open_secondary: {
      message: 'Montrer les actions secondaires',
    },
    skyux_summary_action_bar_expand: {
      message: 'Agrandir ou réduire le résumé',
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
export class SkyActionBarsResourcesModule {}
