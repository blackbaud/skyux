import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { SkyModalModule } from '@skyux/modals';
import { SkyTabsModule } from '@skyux/tabs';

import { SkySummaryActionBarModule } from '../summary-action-bar.module';

import { SplitViewMockComponent } from './split-view-mocks/split-view-mock.component.fixture';
import { SkySummaryActionBarModalEmptyTestComponent } from './summary-action-bar-modal-empty.component.fixture';
import { SkySummaryActionBarModalTestComponent } from './summary-action-bar-modal.component.fixture';
import { SkySummaryActionBarSplitViewTestComponent } from './summary-action-bar-split-view.component.fixture';
import { SkySummaryActionBarTabsTestComponent } from './summary-action-bar-tabs.component.fixture';
import { SkySummaryActionBarTestComponent } from './summary-action-bar.component.fixture';

@NgModule({
  declarations: [
    SkySummaryActionBarTestComponent,
    SkySummaryActionBarModalTestComponent,
    SkySummaryActionBarModalEmptyTestComponent,
    SkySummaryActionBarTabsTestComponent,
    SkySummaryActionBarSplitViewTestComponent,
    SplitViewMockComponent,
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    RouterTestingModule,
    SkyKeyInfoModule,
    SkyModalModule,
    SkyTabsModule,
    SkySummaryActionBarModule,
  ],
  exports: [
    BrowserModule,
    RouterTestingModule,
    SkyModalModule,
    SkyKeyInfoModule,
    SkySummaryActionBarModule,
    SplitViewMockComponent,
  ],
  entryComponents: [
    SkySummaryActionBarModalTestComponent,
    SkySummaryActionBarModalEmptyTestComponent,
  ],
})
export class SkySummaryActionBarFixtureModule {}
