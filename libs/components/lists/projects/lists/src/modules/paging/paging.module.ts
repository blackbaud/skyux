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
  SkyThemeModule
} from '@skyux/theme';

import {
  SkyListsResourcesModule
} from '../shared/sky-lists-resources.module';

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
        SkyListsResourcesModule,
        SkyThemeModule
    ],
  exports: [
    SkyPagingComponent
  ]
})
export class SkyPagingModule { }
