import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyDropdownModule } from '@skyux/popovers';

import { SkyListBuilderResourcesModule } from '../../shared/sky-list-builder-resources.module';

import { SkyListSecondaryActionComponent } from './list-secondary-action.component';
import { SkyListSecondaryActionsHostComponent } from './list-secondary-actions-host.component';
import { SkyListSecondaryActionsComponent } from './list-secondary-actions.component';

/**
 * @deprecated List builder and its features are deprecated. Use data manager instead. For more information, see https://developer.blackbaud.com/skyux/components/data-manager.
 */
@NgModule({
  declarations: [
    SkyListSecondaryActionsComponent,
    SkyListSecondaryActionsHostComponent,
    SkyListSecondaryActionComponent,
  ],
  imports: [
    CommonModule,
    SkyDropdownModule,
    SkyIconModule,
    SkyListBuilderResourcesModule,
  ],
  exports: [SkyListSecondaryActionsComponent, SkyListSecondaryActionComponent],
})
export class SkyListSecondaryActionsModule {}
