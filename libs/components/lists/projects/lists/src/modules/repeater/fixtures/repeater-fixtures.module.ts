import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SkyDropdownModule } from '@skyux/popovers';

import { SkyRepeaterModule } from '../repeater.module';

import { NestedRepeaterTestComponent } from './nested-repeater.component.fixture';

import { RepeaterTestComponent } from './repeater.component.fixture';

import { RepeaterAsyncItemsTestComponent } from './repeater-async-items.component.fixture';

import { RepeaterInlineFormFixtureComponent } from './repeater-inline-form.component.fixture';

import { RepeaterWithMissingTagsFixtureComponent } from './repeater-missing-tag.fixture';

@NgModule({
  declarations: [
    RepeaterAsyncItemsTestComponent,
    RepeaterInlineFormFixtureComponent,
    RepeaterTestComponent,
    RepeaterWithMissingTagsFixtureComponent,
    NestedRepeaterTestComponent,
  ],
  imports: [
    CommonModule,
    NoopAnimationsModule,
    SkyDropdownModule,
    SkyRepeaterModule,
  ],
  exports: [
    RepeaterAsyncItemsTestComponent,
    RepeaterInlineFormFixtureComponent,
    RepeaterTestComponent,
    RepeaterWithMissingTagsFixtureComponent,
    NestedRepeaterTestComponent,
  ],
})
export class SkyRepeaterFixturesModule {}
