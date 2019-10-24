import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyRepeaterModule
} from '../repeater.module';

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
    SkyDropdownModule,
    SkyRepeaterModule
  ],
  exports: [
    RepeaterInlineFormFixtureComponent,
    RepeaterTestComponent
  ]
})
export class SkyRepeaterFixturesModule { }
