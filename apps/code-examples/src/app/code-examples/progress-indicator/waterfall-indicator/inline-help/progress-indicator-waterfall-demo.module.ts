import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyProgressIndicatorModule } from '@skyux/progress-indicator';

import { WaterfallIndicatorDocsComponent } from './progress-indicator-waterfall-demo.component';

@NgModule({
  imports: [CommonModule, SkyProgressIndicatorModule, SkyHelpInlineModule],
  exports: [WaterfallIndicatorDocsComponent],
  declarations: [WaterfallIndicatorDocsComponent],
})
export class SkyProgressIndicatorPassiveDemoModule {}
