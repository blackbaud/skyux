import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyThemeService
} from '@skyux/theme';

import {
  SkyVerticalTabsetModule
} from '../vertical-tabset.module';

import {
  VerticalTabsetTestComponent
} from './vertical-tabset.component.fixture';

import {
  VerticalTabsetEmptyGroupTestComponent
} from './vertical-tabset-empty-group.component';

import {
  VerticalTabsetWithNgForTestComponent
} from './vertical-tabset-ngfor.component.fixture';

import {
  VerticalTabsetNoActiveTestComponent
} from './vertical-tabset-no-active.component.fixture';

import {
  VerticalTabsetNoGroupTestComponent
} from './vertical-tabset-no-group.component.fixture';

@NgModule({
  declarations: [
    VerticalTabsetTestComponent,
    VerticalTabsetEmptyGroupTestComponent,
    VerticalTabsetNoGroupTestComponent,
    VerticalTabsetNoActiveTestComponent,
    VerticalTabsetWithNgForTestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyVerticalTabsetModule
  ],
  exports: [
    VerticalTabsetTestComponent,
    VerticalTabsetEmptyGroupTestComponent,
    VerticalTabsetNoGroupTestComponent,
    VerticalTabsetNoActiveTestComponent,
    VerticalTabsetWithNgForTestComponent
  ],
  providers: [
    SkyThemeService
  ]
})
export class SkyVerticalTabsFixturesModule { }
