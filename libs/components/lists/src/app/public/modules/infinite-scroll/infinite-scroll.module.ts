// #region imports
import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyI18nModule
} from '@skyux/i18n/modules/i18n';

import {
  SkyWaitModule
} from '@skyux/indicators/modules/wait';

import {
  SkyInfiniteScrollComponent
} from './infinite-scroll.component';
// #endregion

@NgModule({
  declarations: [
    SkyInfiniteScrollComponent
  ],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyWaitModule
  ],
  exports: [
    SkyInfiniteScrollComponent
  ]
})
export class SkyInfiniteScrollModule { }
