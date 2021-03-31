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
  SkyMediaQueryModule
} from '@skyux/core';

import {
  SkyChevronModule,
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyThemeModule
} from '@skyux/theme';

import {
  SkyTabsResourcesModule
} from '../shared/tabs-resources.module';

import {
  SkyVerticalTabsetComponent
} from './vertical-tabset.component';

import {
  SkyVerticalTabComponent
} from './vertical-tab.component';

import {
  SkyVerticalTabsetAdapterService
} from './vertical-tabset-adapter.service';

import {
  SkyVerticalTabsetGroupComponent
} from './vertical-tabset-group.component';

@NgModule({
  declarations: [
    SkyVerticalTabsetComponent,
    SkyVerticalTabsetGroupComponent,
    SkyVerticalTabComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    SkyChevronModule,
    SkyIconModule,
    SkyMediaQueryModule,
    SkyTabsResourcesModule,
    SkyThemeModule
  ],
  providers: [
    SkyVerticalTabsetAdapterService
  ],
  exports: [
    SkyVerticalTabsetComponent,
    SkyVerticalTabsetGroupComponent,
    SkyVerticalTabComponent
  ]
})
export class SkyVerticalTabsetModule { }
