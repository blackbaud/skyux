import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyMediaQueryModule
} from '@skyux/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyThemeModule,
  SkyThemeService
} from '@skyux/theme';

import {
  SkyListsResourcesModule
} from '../shared/lists-resources.module';

import {
  SkySortItemComponent
} from './sort-item.component';

import {
  SkySortComponent
} from './sort.component';

@NgModule({
  declarations: [
    SkySortComponent,
    SkySortItemComponent
  ],
  imports: [
    CommonModule,
    SkyDropdownModule,
    SkyIconModule,
    SkyListsResourcesModule,
    SkyMediaQueryModule,
    SkyThemeModule
  ],
  exports: [
    SkySortComponent,
    SkySortItemComponent
  ],
  providers: [
    SkyThemeService
  ]
})
export class SkySortModule { }
