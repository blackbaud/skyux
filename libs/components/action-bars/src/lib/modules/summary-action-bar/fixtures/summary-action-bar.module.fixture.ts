import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
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
    NoopAnimationsModule,
    SkyKeyInfoModule,
    SkyModalModule,
    SkyTabsModule,
    SkySummaryActionBarModule,
  ],
  providers: [provideRouter([])],
})
export class SkySummaryActionBarFixtureModule {}
