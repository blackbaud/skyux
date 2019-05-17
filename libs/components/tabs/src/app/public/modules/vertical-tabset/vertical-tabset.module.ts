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
  SkyTabsResourcesModule
} from '../shared';

import {
  SkyVerticalTabsetComponent
} from './vertical-tabset.component';

import {
  SkyVerticalTabComponent
} from './vertical-tab.component';

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
    SkyTabsResourcesModule
  ],
  exports: [
    SkyVerticalTabsetComponent,
    SkyVerticalTabsetGroupComponent,
    SkyVerticalTabComponent
  ]
})
export class SkyVerticalTabsetModule { }
