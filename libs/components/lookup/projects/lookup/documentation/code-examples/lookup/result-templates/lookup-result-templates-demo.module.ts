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
} from 'projects/lookup/src/public-api';

import {
  LookupResultTemplatesDemoComponent
} from './lookup-result-templates-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyLookupModule
  ],
  declarations: [
    LookupResultTemplatesDemoComponent
  ],
  exports: [
    LookupResultTemplatesDemoComponent
  ]
})
export class LookupResultTemplatesDemoModule { }
