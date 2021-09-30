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
  SkyIdModule
} from '@skyux/core';

import {
  SkyRadioModule,
  SkySelectionBoxModule
} from 'projects/forms/src/public-api';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SelectionBoxDemoComponent
} from './selection-box-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyIconModule,
    SkyIdModule,
    SkyRadioModule,
    SkySelectionBoxModule
  ],
  declarations: [
    SelectionBoxDemoComponent
  ],
  exports: [
    SelectionBoxDemoComponent
  ]
})

export class SkySelectionBoxDemoModule {
}
