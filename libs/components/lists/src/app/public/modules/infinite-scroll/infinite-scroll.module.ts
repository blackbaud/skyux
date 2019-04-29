// #region imports
import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyWaitModule
} from '@skyux/indicators';

import {
  SkyListsResourcesModule
} from '../shared';

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
    SkyListsResourcesModule,
    SkyWaitModule
  ],
  exports: [
    SkyInfiniteScrollComponent
  ],
  providers: [
    SkyAppWindowRef
  ]
})
export class SkyInfiniteScrollModule { }
