import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/indicators';
import { SkyDropdownModule } from '@skyux/popovers';

import { SkyListBuilderResourcesModule } from '../../shared/sky-list-builder-resources.module';

import { SkyListSecondaryActionComponent } from './list-secondary-action.component';
import { SkyListSecondaryActionsHostComponent } from './list-secondary-actions-host.component';
import { SkyListSecondaryActionsComponent } from './list-secondary-actions.component';

@NgModule({
  declarations: [
    SkyListSecondaryActionsComponent,
    SkyListSecondaryActionsHostComponent,
    SkyListSecondaryActionComponent,
  ],
  imports: [
    CommonModule,
    SkyDropdownModule,
    SkyI18nModule,
    SkyIconModule,
    SkyListBuilderResourcesModule,
  ],
  exports: [SkyListSecondaryActionsComponent, SkyListSecondaryActionComponent],
})
export class SkyListSecondaryActionsModule {}
