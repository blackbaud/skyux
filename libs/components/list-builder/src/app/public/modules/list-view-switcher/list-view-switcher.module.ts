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
  SkyMediaQueryModule
} from '@skyux/core';

import {
  SkyRadioModule
} from '@skyux/forms';

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
  SkyListModule
} from '../list/list.module';

import {
  SkyListBuilderResourcesModule
} from '../shared/list-builder-resources.module';

import {
  SkyListViewSwitcherComponent
} from './list-view-switcher.component';

import {
  SkyListViewSwitcherCustomButtonComponent
} from './list-view-switcher-custom-button.component';

@NgModule({
  declarations: [
    SkyListViewSwitcherComponent,
    SkyListViewSwitcherCustomButtonComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyDropdownModule,
    SkyI18nModule,
    SkyIconModule,
    SkyListBuilderResourcesModule,
    SkyListModule,
    SkyMediaQueryModule,
    SkyRadioModule
  ],
  exports: [
    SkyListViewSwitcherComponent,
    SkyListViewSwitcherCustomButtonComponent
  ]
})
export class SkyListViewSwitcherModule { }
