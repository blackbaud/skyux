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
  SkyInputBoxModule
} from '@skyux/forms';

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
    SkyInputBoxModule,
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
