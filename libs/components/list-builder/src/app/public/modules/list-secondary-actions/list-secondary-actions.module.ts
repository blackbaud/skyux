import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  SkyDropdownModule
} from '@skyux/popovers';
import {
  SkyI18nModule
} from '@skyux/i18n';
import {
  SkyMediaQueryModule
} from '@skyux/core';
import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyListSecondaryActionsComponent
} from './list-secondary-actions.component';
import {
  SkyListSecondaryActionComponent
} from './list-secondary-action.component';

@NgModule({
  declarations: [
    SkyListSecondaryActionsComponent,
    SkyListSecondaryActionComponent
  ],
  imports: [
    CommonModule,
    SkyDropdownModule,
    SkyI18nModule,
    SkyMediaQueryModule,
    SkyIconModule
  ],
  exports: [
    SkyListSecondaryActionsComponent,
    SkyListSecondaryActionComponent
  ],
  providers: [
  ]
})
export class SkyListSecondaryActionsModule { }
