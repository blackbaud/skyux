import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyProgressIndicatorModule } from '@skyux/progress-indicator';

import { WaterfallIndicatorDocsComponent } from './progress-indicator-waterfall-demo.component';

@NgModule({
  imports: [CommonModule, SkyProgressIndicatorModule],
  exports: [WaterfallIndicatorDocsComponent],
  declarations: [WaterfallIndicatorDocsComponent],
})
export class SkyProgressIndicatorPassiveDemoModule {}
