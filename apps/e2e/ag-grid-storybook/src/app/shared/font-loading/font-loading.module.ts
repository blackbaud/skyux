import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/indicators';

import { FontLoadingComponent } from './font-loading.component';

@NgModule({
  declarations: [FontLoadingComponent],
  imports: [CommonModule, SkyIconModule],
  exports: [FontLoadingComponent],
})
export class FontLoadingModule {}
