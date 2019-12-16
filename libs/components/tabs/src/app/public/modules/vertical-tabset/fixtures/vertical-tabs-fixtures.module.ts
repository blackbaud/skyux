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
  SkyVerticalTabsetModule
} from '../';

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
  ]
})
export class SkyVerticalTabsFixturesModule { }
