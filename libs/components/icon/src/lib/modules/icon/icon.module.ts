import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyIconClassListPipe } from './icon-class-list.pipe';
import { SkyIconSvgComponent } from './icon-svg.component';
import { SkyIconComponent } from './icon.component';

@NgModule({
  declarations: [SkyIconClassListPipe, SkyIconComponent],
  imports: [CommonModule, SkyIconSvgComponent],
  exports: [SkyIconComponent],
})
export class SkyIconModule {}
