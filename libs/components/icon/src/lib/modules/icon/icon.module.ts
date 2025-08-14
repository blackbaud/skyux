import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyIconSvgComponent } from './icon-svg.component';
import { SkyIconComponent } from './icon.component';

@NgModule({
  declarations: [SkyIconComponent],
  imports: [CommonModule, SkyIconSvgComponent],
  exports: [SkyIconComponent],
})
export class SkyIconModule {}
