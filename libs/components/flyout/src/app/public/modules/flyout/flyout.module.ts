import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  RouterModule
} from '@angular/router';

import {
  SkyAppWindowRef,
  SkyCoreAdapterService,
  SkyDynamicComponentModule,
  SkyUIConfigService
} from '@skyux/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyHrefModule
} from '@skyux/router';

import {
  SkyThemeModule
} from '@skyux/theme';

import {
  SkyFlyoutResourcesModule
} from '../shared/flyout-resources.module';

import {
  SkyFlyoutAdapterService
} from './flyout-adapter.service';

import {
  SkyFlyoutComponent
} from './flyout.component';

import {
  SkyFlyoutIteratorComponent
} from './flyout-iterator.component';

import {
  SkyFlyoutService
} from './flyout.service';

@NgModule({
  declarations: [
    SkyFlyoutComponent,
    SkyFlyoutIteratorComponent
  ],
  providers: [
    SkyAppWindowRef,
    SkyCoreAdapterService,
    SkyFlyoutAdapterService,
    SkyFlyoutService,
    SkyUIConfigService
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    SkyI18nModule,
    SkyIconModule,
    SkyFlyoutResourcesModule,
    SkyDynamicComponentModule,
    SkyThemeModule,
    SkyHrefModule
  ],
  exports: [
    SkyFlyoutComponent
  ],
  entryComponents: [
    SkyFlyoutComponent
  ]
})
export class SkyFlyoutModule { }
