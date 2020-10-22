import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyTokenComponent
} from './token.component';

import {
  SkyTokensComponent
} from './tokens.component';

import {
  SkyIconModule
} from '../icon/icon.module';

import {
  SkyIndicatorsResourcesModule
} from '../shared/indicators-resources.module';

@NgModule({
  declarations: [
    SkyTokenComponent,
    SkyTokensComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    SkyI18nModule,
    SkyIconModule,
    SkyIndicatorsResourcesModule
  ],
  exports: [
    SkyTokenComponent,
    SkyTokensComponent
  ]
})
export class SkyTokensModule { }
