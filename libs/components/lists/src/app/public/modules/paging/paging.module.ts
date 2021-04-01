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
  SkyThemeModule,
  SkyThemeService
} from '@skyux/theme';

import {
  SkyListsResourcesModule
} from '../shared/lists-resources.module';

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
  ],
  providers: [
    SkyThemeService
  ]
})
export class SkyPagingModule { }
