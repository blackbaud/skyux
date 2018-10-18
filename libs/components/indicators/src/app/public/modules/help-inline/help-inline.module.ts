import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyIconModule
} from '../icon';

import {
  SkyIndicatorsResourcesModule
} from '../shared';

import {
  SkyHelpInlineComponent
} from './help-inline.component';

@NgModule({
  declarations: [
    SkyHelpInlineComponent
  ],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyIconModule,
    SkyIndicatorsResourcesModule
  ],
  exports: [
    SkyHelpInlineComponent
  ]
})
export class SkyHelpInlineModule { }
