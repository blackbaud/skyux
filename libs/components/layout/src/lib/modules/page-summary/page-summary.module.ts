import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyPageSummaryAlertComponent } from './page-summary-alert.component';
import { SkyPageSummaryContentComponent } from './page-summary-content.component';
import { SkyPageSummaryImageComponent } from './page-summary-image.component';
import { SkyPageSummaryKeyInfoComponent } from './page-summary-key-info.component';
import { SkyPageSummaryStatusComponent } from './page-summary-status.component';
import { SkyPageSummarySubtitleComponent } from './page-summary-subtitle.component';
import { SkyPageSummaryTitleComponent } from './page-summary-title.component';
import { SkyPageSummaryComponent } from './page-summary.component';

@NgModule({
  declarations: [
    SkyPageSummaryAlertComponent,
    SkyPageSummaryComponent,
    SkyPageSummaryContentComponent,
    SkyPageSummaryImageComponent,
    SkyPageSummaryKeyInfoComponent,
    SkyPageSummaryStatusComponent,
    SkyPageSummarySubtitleComponent,
    SkyPageSummaryTitleComponent,
  ],
  imports: [CommonModule],
  exports: [
    SkyPageSummaryAlertComponent,
    SkyPageSummaryComponent,
    SkyPageSummaryContentComponent,
    SkyPageSummaryImageComponent,
    SkyPageSummaryKeyInfoComponent,
    SkyPageSummaryStatusComponent,
    SkyPageSummarySubtitleComponent,
    SkyPageSummaryTitleComponent,
  ],
})
export class SkyPageSummaryModule {}
