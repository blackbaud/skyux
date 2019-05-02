import {
  NgModule
} from '@angular/core';

import {
  SkyAppTestModule
} from '@skyux-sdk/builder/runtime/testing/browser';

import {
  MyLibrarySampleModule
} from '../sample.module';

@NgModule({
  imports: [
    MyLibrarySampleModule,
    SkyAppTestModule
  ]
})
export class MyLibrarySampleTestModule { }
