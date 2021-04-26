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
  RouterTestingModule
} from '@angular/router/testing';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyTabsModule
} from '../tabs.module';

import {
  TabsetActiveTestComponent
} from './tabset-active.component.fixture';

import {
  TabsetActiveTwoWayBindingTestComponent
} from './tabset-active-two-way.component.fixture';

import {
  TabsetLoopTestComponent
} from './tabset-loop.component.fixture';

import {
  SkyTabsetPermalinksFixtureComponent
} from './tabset-permalinks.component.fixture';

import {
  SkyWizardTestFormComponent
} from './tabset-wizard.component.fixture';

import {
  TabsetTestComponent
} from './tabset.component.fixture';

@NgModule({
  declarations: [
    TabsetLoopTestComponent,
    TabsetTestComponent,
    SkyTabsetPermalinksFixtureComponent,
    SkyWizardTestFormComponent,
    TabsetActiveTestComponent,
    TabsetActiveTwoWayBindingTestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyModalModule,
    SkyTabsModule,
    RouterTestingModule
  ],
  exports: [
    TabsetLoopTestComponent,
    TabsetTestComponent,
    SkyTabsetPermalinksFixtureComponent,
    SkyWizardTestFormComponent,
    TabsetActiveTestComponent,
    TabsetActiveTwoWayBindingTestComponent
  ],
  entryComponents: [
    SkyWizardTestFormComponent
  ]
})
export class SkyTabsFixturesModule { }
