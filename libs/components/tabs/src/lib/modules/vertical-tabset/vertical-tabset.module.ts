import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIdModule } from '@skyux/core';
import {
  SkyExpansionIndicatorModule,
  SkyIconModule,
  SkyStatusIndicatorModule,
} from '@skyux/indicators';
import { SkyThemeModule } from '@skyux/theme';

import { SkyTabsResourcesModule } from '../shared/sky-tabs-resources.module';

import { SkyVerticalTabComponent } from './vertical-tab.component';
import { SkyVerticalTabsetAdapterService } from './vertical-tabset-adapter.service';
import { SkyVerticalTabsetGroupComponent } from './vertical-tabset-group.component';
import { SkyVerticalTabsetComponent } from './vertical-tabset.component';

@NgModule({
  declarations: [
    SkyVerticalTabsetComponent,
    SkyVerticalTabsetGroupComponent,
    SkyVerticalTabComponent,
  ],
  imports: [
    CommonModule,
    SkyIconModule,
    SkyIdModule,
    SkyExpansionIndicatorModule,
    SkyStatusIndicatorModule,
    SkyTabsResourcesModule,
    SkyThemeModule,
  ],
  providers: [SkyVerticalTabsetAdapterService],
  exports: [
    SkyVerticalTabsetComponent,
    SkyVerticalTabsetGroupComponent,
    SkyVerticalTabComponent,
  ],
})
export class SkyVerticalTabsetModule {}
