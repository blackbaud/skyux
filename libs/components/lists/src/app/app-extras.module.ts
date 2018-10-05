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

@NgModule({
  imports: [
    SkyFilterModule,
    SkyInfiniteScrollModule,
    SkyPagingModule,
    SkyRepeaterModule,
    SkySortModule
  ],
  exports: [
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
