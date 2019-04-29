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
  SkyChevronModule
} from '@skyux/indicators/modules/chevron';

import {
  SkyIconModule
} from '@skyux/indicators/modules/icon';

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
    SkyTabsResourcesModule
  ],
  exports: [
    SkyVerticalTabsetComponent,
    SkyVerticalTabsetGroupComponent,
    SkyVerticalTabComponent
  ]
})
export class SkyVerticalTabsetModule { }
