import {
  NgModule
} from '@angular/core';

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
  SkySortModule
} from './public/modules/sort';

import {
  SkyRepeaterModule
} from './public/modules/repeater';

import {
  SkyDropdownModule
} from '@skyux/popovers/modules/dropdown';

@NgModule({
  imports: [
    SkyDropdownModule,
    SkyFilterModule,
    SkyInfiniteScrollModule,
    SkyPagingModule,
    SkyRepeaterModule,
    SkySortModule
  ],
  exports: [
    SkyDropdownModule,
    SkyFilterModule,
    SkyInfiniteScrollModule,
    SkyPagingModule,
    SkyRepeaterModule,
    SkySortModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
