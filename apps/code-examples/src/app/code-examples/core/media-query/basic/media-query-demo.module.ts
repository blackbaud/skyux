import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyMediaQueryModule } from '@skyux/core';
import { SkyAlertModule } from '@skyux/indicators';

import { MediaQueryDemoComponent } from './media-query-demo.component';

@NgModule({
  imports: [CommonModule, SkyAlertModule, SkyMediaQueryModule],
  declarations: [MediaQueryDemoComponent],
  exports: [MediaQueryDemoComponent],
})
export class MediaQueryDemoModule {}
