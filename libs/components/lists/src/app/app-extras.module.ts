import {
  NgModule
} from '@angular/core';

import {
  SkyIconModule
} from '@skyux/indicators/modules/icon';

import {
  SkyFluidGridModule
} from '@skyux/layout';

import {
  SkyDropdownModule
} from '@skyux/popovers/modules/dropdown';

import {
  SkyFilterModule
} from './public/modules/filter';

import {
  SkyInfiniteScrollModule
} from './public/modules/infinite-scroll';

import {
  SkyPagingModule
} from './public/modules/paging';

import {
  SkyRepeaterModule
} from './public/modules/repeater';

import {
  SkySortModule
} from './public/modules/sort';

@NgModule({
  imports: [
    SkyDropdownModule,
    SkyFilterModule,
    SkyInfiniteScrollModule,
    SkyPagingModule,
    SkyRepeaterModule,
    SkySortModule,
    SkyIconModule,
    SkyFluidGridModule
  ],
  exports: [
    SkyDropdownModule,
    SkyFilterModule,
    SkyInfiniteScrollModule,
    SkyPagingModule,
    SkyRepeaterModule,
    SkySortModule,
    SkyIconModule,
    SkyFluidGridModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
