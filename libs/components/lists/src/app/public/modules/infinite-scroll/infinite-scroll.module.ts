import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyWaitModule
} from '@skyux/indicators';

import {
  SkyListsResourcesModule
} from '../shared/lists-resources.module';

import {
  SkyInfiniteScrollComponent
} from './infinite-scroll.component';

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
