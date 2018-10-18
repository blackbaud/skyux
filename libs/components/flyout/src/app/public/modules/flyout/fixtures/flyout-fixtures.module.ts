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
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  SkyLibResourcesTestService
} from '@skyux/i18n/testing';

import { SkyFlyoutModule } from '../flyout.module';
import { SkyFlyoutTestComponent } from './flyout.component.fixture';
import { SkyFlyoutTestSampleComponent } from './flyout-sample.component.fixture';

@NgModule({
  declarations: [
    SkyFlyoutTestComponent,
    SkyFlyoutTestSampleComponent
  ],
  imports: [
    CommonModule,
    NoopAnimationsModule,
    RouterTestingModule,
    SkyFlyoutModule
  ],
  exports: [
    SkyFlyoutTestSampleComponent
  ],
  entryComponents: [
    SkyFlyoutTestSampleComponent
  ],
  providers: [
    {
      provide: SkyLibResourcesService,
      useClass: SkyLibResourcesTestService
    }
  ]
})
export class SkyFlyoutFixturesModule { }
