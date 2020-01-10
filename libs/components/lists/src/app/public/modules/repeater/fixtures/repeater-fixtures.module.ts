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
  RepeaterAsyncItemsTestComponent
} from './repeater-async-items.component.fixture';

import {
  RepeaterInlineFormFixtureComponent
} from './repeater-inline-form.component.fixture';

import {
  RepeaterWithMissingTagsFixtureComponent
} from './repeater-missing-tag.fixture';

@NgModule({
  declarations: [
    RepeaterAsyncItemsTestComponent,
    RepeaterInlineFormFixtureComponent,
    RepeaterTestComponent,
    RepeaterWithMissingTagsFixtureComponent
  ],
  imports: [
    CommonModule,
    SkyDropdownModule,
    SkyRepeaterModule
  ],
  exports: [
    RepeaterAsyncItemsTestComponent,
    RepeaterInlineFormFixtureComponent,
    RepeaterTestComponent,
    RepeaterWithMissingTagsFixtureComponent
  ]
})
export class SkyRepeaterFixturesModule { }
