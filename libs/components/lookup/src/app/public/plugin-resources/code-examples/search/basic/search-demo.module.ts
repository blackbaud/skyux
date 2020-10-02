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
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkySearchModule
} from '@skyux/lookup';

import {
  SearchDemoComponent
} from './search-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyRepeaterModule,
    SkySearchModule,
    SkyToolbarModule
  ],
  declarations: [
    SearchDemoComponent
  ],
  exports: [
    SearchDemoComponent
  ]
})
export class SearchDemoModule { }
