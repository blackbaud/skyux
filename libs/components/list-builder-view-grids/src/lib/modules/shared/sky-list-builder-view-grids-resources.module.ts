/* istanbul ignore file */
/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-list-builder-view-grids' schematic.
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
    skyux_grid_column_picker_cancel: { message: 'Cancel' },
    skyux_grid_column_picker_header: {
      message: 'Choose columns to show in the list',
    },
    skyux_grid_column_picker_search_placeholder: {
      message: 'Search for columns',
    },
    skyux_grid_column_picker_submit: { message: 'Apply changes' },
    skyux_grid_columns_button: { message: 'Choose columns' },
    skyux_grid_columns_toolbar_button: { message: 'Columns' },
  },
};

SkyLibResourcesService.addResources(RESOURCES);

/**
 * Import into any component library module that needs to use resource strings.
 */
@NgModule({
  exports: [SkyI18nModule],
})
export class SkyListBuilderViewGridsResourcesModule {}
