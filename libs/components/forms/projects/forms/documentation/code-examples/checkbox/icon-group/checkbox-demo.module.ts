import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  SkyCheckboxModule
} from 'projects/forms/src/public-api';

import {
  CheckboxDemoComponent
} from './checkbox-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyCheckboxModule
  ],
  declarations: [
    CheckboxDemoComponent
  ],
  exports: [
    CheckboxDemoComponent
  ]
})

export class SkyCheckboxDemoModule {
}
