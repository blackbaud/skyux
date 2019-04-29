import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

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
  SkyListsResourcesModule
} from '../shared';

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
    SkyMediaQueryModule,
    SkyIconModule,
    SkyListsResourcesModule
  ],
  exports: [
    SkySortComponent,
    SkySortItemComponent
  ]
})
export class SkySortModule { }
