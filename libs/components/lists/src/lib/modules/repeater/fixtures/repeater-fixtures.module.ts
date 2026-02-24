import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyDropdownModule } from '@skyux/popovers';

import { SkyRepeaterModule } from '../repeater.module';

import { A11yRepeaterTestComponent } from './a11y-repeater.component.fixture';
import { NestedRepeaterTestComponent } from './nested-repeater.component.fixture';
import { RepeaterAsyncItemsTestComponent } from './repeater-async-items.component.fixture';
import { RepeaterInlineFormFixtureComponent } from './repeater-inline-form.component.fixture';
import { RepeaterWithMissingTagsFixtureComponent } from './repeater-missing-tag.fixture';
import { RepeaterScrollableHostTestComponent } from './repeater-scrollable-host.component.fixture';
import { RepeaterTestComponent } from './repeater.component.fixture';

@NgModule({
  declarations: [
    RepeaterAsyncItemsTestComponent,
    RepeaterInlineFormFixtureComponent,
    RepeaterTestComponent,
    RepeaterScrollableHostTestComponent,
    RepeaterWithMissingTagsFixtureComponent,
    NestedRepeaterTestComponent,
    A11yRepeaterTestComponent,
  ],
  imports: [NoopAnimationsModule, SkyDropdownModule, SkyRepeaterModule],
  exports: [
    RepeaterAsyncItemsTestComponent,
    RepeaterInlineFormFixtureComponent,
    RepeaterTestComponent,
    RepeaterScrollableHostTestComponent,
    RepeaterWithMissingTagsFixtureComponent,
    NestedRepeaterTestComponent,
    A11yRepeaterTestComponent,
  ],
})
export class SkyRepeaterFixturesModule {}
