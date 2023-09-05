import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyThemeModule } from '@skyux/theme';

import { SkySplitViewModule } from '../split-view.module';

import { SplitViewFixtureComponent } from './split-view.fixture';

@NgModule({
  declarations: [SplitViewFixtureComponent],
  imports: [
    CommonModule,
    SkySplitViewModule,
    SkySummaryActionBarModule,
    SkyThemeModule,
  ],
})
export class SplitViewFixturesModule {}
