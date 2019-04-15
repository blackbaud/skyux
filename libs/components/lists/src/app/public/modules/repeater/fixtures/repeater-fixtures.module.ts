import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyRepeaterModule
} from '../';

import {
  RepeaterTestComponent
} from './repeater.component.fixture';

import {
  RepeaterInlineFormFixtureComponent
} from './repeater-inline-form.component.fixture';

@NgModule({
  declarations: [
    RepeaterInlineFormFixtureComponent,
    RepeaterTestComponent
  ],
  imports: [
    CommonModule,
    SkyRepeaterModule
  ],
  exports: [
    RepeaterInlineFormFixtureComponent,
    RepeaterTestComponent
  ]
})
export class SkyRepeaterFixturesModule { }
