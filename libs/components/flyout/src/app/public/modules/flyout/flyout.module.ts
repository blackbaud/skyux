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
  RouterModule
} from '@angular/router';

import {
  SkyDynamicComponentModule,
  SkyWindowRefService
} from '@skyux/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyFlyoutResourcesModule
} from '../shared';

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
    SkyFlyoutAdapterService,
    SkyFlyoutService,
    SkyWindowRefService
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SkyI18nModule,
    SkyIconModule,
    SkyFlyoutResourcesModule,
    SkyDynamicComponentModule
  ],
  exports: [
    SkyFlyoutComponent
  ],
  entryComponents: [
    SkyFlyoutComponent
  ]
})
export class SkyFlyoutModule { }
