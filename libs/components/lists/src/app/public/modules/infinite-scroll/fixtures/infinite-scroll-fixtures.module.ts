// #region imports
import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyInfiniteScrollModule
} from '../infinite-scroll.module';

import {
  SkyInfiniteScrollTestComponent
} from './infinite-scroll.component.fixture';
// #endregion

@NgModule({
  declarations: [
    SkyInfiniteScrollTestComponent
  ],
  imports: [
    CommonModule,
    SkyInfiniteScrollModule
  ],
  exports: [
    SkyInfiniteScrollTestComponent
  ]
})
export class SkyInfiniteScrollFixturesModule { }
