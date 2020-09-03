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
  SkyCheckboxModule
} from '@skyux/forms';

import {
  CheckboxDemoComponent
} from './checkbox-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule
  ],
  declarations: [
    CheckboxDemoComponent
  ],
  exports: [
    CheckboxDemoComponent
  ]
})

export class SkyRadioDemoModule {
}
