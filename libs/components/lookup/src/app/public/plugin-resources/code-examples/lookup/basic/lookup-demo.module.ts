import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ReactiveFormsModule
} from '@angular/forms';

import {
  SkyIdModule
} from '@skyux/core';

import {
  SkyLookupModule
} from '@skyux/lookup';

import {
  LookupDemoComponent
} from './lookup-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyIdModule,
    SkyLookupModule
  ],
  declarations: [
    LookupDemoComponent
  ],
  exports: [
    LookupDemoComponent
  ]
})
export class LookupDemoModule { }
