import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyProgressIndicatorModule } from '@skyux/progress-indicator';

import { SkyProgressIndicatorPassiveDemoComponent } from './progress-indicator-passive-demo.component';

@NgModule({
  imports: [CommonModule, SkyProgressIndicatorModule, SkyHelpInlineModule],
  exports: [SkyProgressIndicatorPassiveDemoComponent],
  declarations: [SkyProgressIndicatorPassiveDemoComponent],
})
export class SkyProgressIndicatorPassiveDemoModule {}
