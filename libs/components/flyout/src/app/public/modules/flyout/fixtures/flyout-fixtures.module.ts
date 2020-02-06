import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyToastModule
} from '@skyux/toast';

import {
  SkyFlyoutModule
} from '../flyout.module';

import {
  SkyFlyoutHostsTestComponent
} from './flyout-hosts.component.fixture';

import {
  SkyFlyoutModalFixtureFormComponent
} from './flyout-modal-form.component';

import {
  SkyFlyoutTestComponent
} from './flyout.component.fixture';

import {
  SkyFlyoutTestSampleComponent
} from './flyout-sample.component.fixture';

@NgModule({
  declarations: [
    SkyFlyoutTestComponent,
    SkyFlyoutTestSampleComponent,
    SkyFlyoutHostsTestComponent,
    SkyFlyoutModalFixtureFormComponent
  ],
  imports: [
    CommonModule,
    RouterTestingModule,
    SkyFlyoutModule,
    SkyModalModule,
    SkyToastModule,
    NoopAnimationsModule
  ],
  exports: [
    SkyFlyoutTestSampleComponent,
    SkyFlyoutHostsTestComponent,
    SkyFlyoutModalFixtureFormComponent
  ],
  entryComponents: [
    SkyFlyoutTestSampleComponent,
    SkyFlyoutHostsTestComponent,
    SkyFlyoutModalFixtureFormComponent
  ]
})
export class SkyFlyoutFixturesModule { }
