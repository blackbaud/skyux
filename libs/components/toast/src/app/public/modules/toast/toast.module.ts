// #region imports
import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyAppWindowRef,
  SkyDynamicComponentModule
} from '@skyux/core';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyToastResourcesModule
} from '../shared/toast-resources.module';

import {
  SkyToastAdapterService
} from './toast-adapter.service';

import {
  SkyToastBodyComponent
} from './toast-body.component';

import {
  SkyToastComponent
} from './toast.component';

import {
  SkyToasterComponent
} from './toaster.component';

import {
  SkyToastService
} from './toast.service';
// #endregion

@NgModule({
  declarations: [
    SkyToastBodyComponent,
    SkyToastComponent,
    SkyToasterComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    SkyDynamicComponentModule,
    SkyI18nModule,
    SkyIconModule,
    SkyToastResourcesModule
  ],
  exports: [
    SkyToastComponent
  ],
  providers: [
    SkyAppWindowRef,
    SkyToastService,
    SkyToastAdapterService
  ],
  entryComponents: [
    SkyToastBodyComponent,
    SkyToastComponent,
    SkyToasterComponent
  ]
})
export class SkyToastModule { }
