import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyIdModule
} from '@skyux/core';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyToolbarModule
} from '@skyux/layout';

import {
  SkyFilterModule,
  SkyRepeaterModule
} from '@skyux/lists';

import {
  FilterDemoComponent
} from './filter-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule,
    SkyIdModule,
    SkyFilterModule,
    SkyRepeaterModule,
    SkyToolbarModule
  ],
  declarations: [
    FilterDemoComponent
  ],
  exports: [
    FilterDemoComponent
  ]
})
export class FilterDemoModule { }
