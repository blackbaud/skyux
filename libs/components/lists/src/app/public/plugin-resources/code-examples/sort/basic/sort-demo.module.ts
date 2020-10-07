import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyToolbarModule
} from '@skyux/layout';

import {
  SkyRepeaterModule,
  SkySortModule
} from '@skyux/lists';

import {
  SortDemoComponent
} from './sort-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyRepeaterModule,
    SkySortModule,
    SkyToolbarModule
  ],
  declarations: [
    SortDemoComponent
  ],
  exports: [
    SortDemoComponent
  ]
})
export class SortDemoModule { }
