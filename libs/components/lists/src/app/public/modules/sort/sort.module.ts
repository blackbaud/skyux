import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  SkyDropdownModule
} from '@skyux/popovers/modules/dropdown';
import {
  SkyI18nModule
} from '@skyux/i18n/modules/i18n';
import {
  SkyMediaQueryModule
} from '@skyux/core/modules/media-query';
import {
  SkyIconModule
} from '@skyux/indicators/modules/icon';

import {
  SkyListsResourcesModule
} from '../shared';

import {
  SkySortComponent
} from './sort.component';
import {
  SkySortItemComponent
} from './sort-item.component';

@NgModule({
  declarations: [
    SkySortComponent,
    SkySortItemComponent
  ],
  imports: [
    CommonModule,
    SkyDropdownModule,
    SkyMediaQueryModule,
    SkyI18nModule,
    SkyIconModule,
    SkyListsResourcesModule
  ],
  exports: [
    SkySortComponent,
    SkySortItemComponent
  ]
})
export class SkySortModule { }
