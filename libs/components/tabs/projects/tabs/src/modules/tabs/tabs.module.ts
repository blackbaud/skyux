import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  RouterModule
} from '@angular/router';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
 SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyThemeModule
} from '@skyux/theme';

import {
  SkyTabsResourcesModule
} from '../shared/sky-tabs-resources.module';

import {
  SkyTabButtonComponent
} from './tab-button.component';

import {
  SkyTabComponent
} from './tab.component';

import {
  SkyTabsetNavButtonComponent
} from './tabset-nav-button.component';

import {
  SkyTabsetComponent
} from './tabset.component';

@NgModule({
  declarations: [
    SkyTabButtonComponent,
    SkyTabComponent,
    SkyTabsetComponent,
    SkyTabsetNavButtonComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SkyDropdownModule,
    SkyI18nModule,
    SkyIconModule,
    SkyTabsResourcesModule,
    SkyThemeModule
  ],
  exports: [
    SkyTabComponent,
    SkyTabsetComponent,
    SkyTabsetNavButtonComponent
  ]
})
export class SkyTabsModule { }
