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
  SkyAutonumericModule
} from '@skyux/autonumeric';

import {
  SkyIdModule
} from '@skyux/core';

import {
  SkyInputBoxModule
} from '@skyux/forms';

import {
  AutonumericDemoComponent
} from './autonumeric-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyAutonumericModule,
    SkyIdModule,
    SkyInputBoxModule
  ],
  declarations: [
    AutonumericDemoComponent
  ],
  exports: [
    AutonumericDemoComponent
  ]
})
export class AutonumericDemoModule { }
