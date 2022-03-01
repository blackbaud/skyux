import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyModalModule } from '@skyux/modals';
import { SkyProgressIndicatorModule } from '@skyux/progress-indicator';

import { SkyProgressIndicatorWaterfallDemoFormComponent } from './progress-indicator-waterfall-demo-form.component';
import { WaterfallIndicatorDocsComponent } from './progress-indicator-waterfall-demo.component';

@NgModule({
  imports: [CommonModule, SkyProgressIndicatorModule, SkyModalModule],
  exports: [WaterfallIndicatorDocsComponent],
  declarations: [
    WaterfallIndicatorDocsComponent,
    SkyProgressIndicatorWaterfallDemoFormComponent,
  ],
  entryComponents: [
    WaterfallIndicatorDocsComponent,
    SkyProgressIndicatorWaterfallDemoFormComponent,
  ],
})
export class SkyProgressIndicatorPassiveDemoModule {}
