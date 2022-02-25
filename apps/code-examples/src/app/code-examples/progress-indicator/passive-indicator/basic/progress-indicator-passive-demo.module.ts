import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { SkyProgressIndicatorModule } from '@skyux/progress-indicator';

import { SkyProgressIndicatorPassiveDemoComponent } from './progress-indicator-passive-demo.component';

@NgModule({
  imports: [CommonModule, SkyProgressIndicatorModule],
  exports: [SkyProgressIndicatorPassiveDemoComponent],
  declarations: [SkyProgressIndicatorPassiveDemoComponent],
})
export class SkyProgressIndicatorPassiveDemoModule {}
