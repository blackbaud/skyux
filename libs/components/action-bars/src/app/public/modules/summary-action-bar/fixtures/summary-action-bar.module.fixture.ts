import {
  NgModule
} from '@angular/core';

import {
  BrowserModule
} from '@angular/platform-browser';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  SkyKeyInfoModule
} from '@skyux/indicators';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyTabsModule
} from '@skyux/tabs';

import {
  SkySummaryActionBarModalTestComponent
} from './summary-action-bar-modal.component.fixture';

import {
  SkySummaryActionBarModule
} from '../summary-action-bar.module';

import {
  SkySummaryActionBarTestComponent
} from './summary-action-bar.component.fixture';

import {
  SkySummaryActionBarTabsTestComponent
} from './summary-action-bar-tabs.component.fixture';

@NgModule({
  declarations: [
    SkySummaryActionBarTestComponent,
    SkySummaryActionBarModalTestComponent,
    SkySummaryActionBarTabsTestComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    RouterTestingModule,
    SkyKeyInfoModule,
    SkyModalModule,
    SkyTabsModule,
    SkySummaryActionBarModule
  ],
  exports: [
    BrowserModule,
    RouterTestingModule,
    SkyModalModule,
    SkyKeyInfoModule,
    SkySummaryActionBarModule
  ],
  entryComponents: [
    SkySummaryActionBarModalTestComponent
  ]
})
export class SkySummaryActionBarFixtureModule { }
