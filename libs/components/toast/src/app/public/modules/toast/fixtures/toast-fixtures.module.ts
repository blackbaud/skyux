// #region imports
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
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  SkyLibResourcesTestService
} from '@skyux/i18n/testing';

import {
  SkyToastModule
} from '../toast.module';

import {
  SkyToastBodyTestComponent
} from './toast-body.component.fixture';

import {
  SkyToastTestComponent
} from './toast.component.fixture';

import {
  SkyToasterTestComponent
} from './toaster.component.fixture';
// #endregion

@NgModule({
  declarations: [
    SkyToastTestComponent,
    SkyToastBodyTestComponent,
    SkyToasterTestComponent
  ],
  imports: [
    CommonModule,
    NoopAnimationsModule,
    SkyToastModule
  ],
  exports: [
    SkyToastTestComponent,
    SkyToasterTestComponent
  ],
  entryComponents: [
    SkyToastBodyTestComponent
  ],
  providers: [
    {
      provide: SkyLibResourcesService,
      useClass: SkyLibResourcesTestService
    }
  ]
})
export class SkyToastFixturesModule { }
