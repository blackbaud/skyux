import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyPagingModule
} from '@skyux/lists';

import {
  PagingDemoComponent
} from './paging-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyPagingModule
  ],
  declarations: [
    PagingDemoComponent
  ],
  exports: [
    PagingDemoComponent
  ]
})
export class SkyPagingDemoComponent { }
