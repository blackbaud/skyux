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
  SkyLookupModule
} from '../lookup.module';

import {
  SkyLookupTestComponent
} from './lookup.component.fixture';

import {
  SkyLookupTemplateTestComponent
} from './lookup-template.component.fixture';

@NgModule({
  declarations: [
    SkyLookupTestComponent,
    SkyLookupTemplateTestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyLookupModule
  ],
  exports: [
    SkyLookupTestComponent,
    SkyLookupTemplateTestComponent
  ]
})
export class SkyLookupFixturesModule { }
