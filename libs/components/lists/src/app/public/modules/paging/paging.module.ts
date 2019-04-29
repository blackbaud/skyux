import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyListsResourcesModule
} from '../shared';

import {
  SkyPagingComponent
} from './paging.component';

@NgModule({
  declarations: [
    SkyPagingComponent
  ],
  imports: [
    CommonModule,
    SkyIconModule,
    SkyListsResourcesModule
  ],
  exports: [
    SkyPagingComponent
  ]
})
export class SkyPagingModule { }
