import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { SkyAvatarModule } from '@skyux/avatar';

import { SkyCheckboxModule } from '@skyux/forms';

import {
  SkyAlertModule,
  SkyKeyInfoModule,
  SkyLabelModule,
} from '@skyux/indicators';

import { SkyPageSummaryModule } from '@skyux/layout';

import { PageSummaryDemoComponent } from './page-summary-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyPageSummaryModule,
    SkyAlertModule,
    SkyAvatarModule,
    SkyCheckboxModule,
    SkyLabelModule,
    SkyKeyInfoModule,
  ],
  declarations: [PageSummaryDemoComponent],
  exports: [PageSummaryDemoComponent],
})
export class PageSummaryDemoModule {}
