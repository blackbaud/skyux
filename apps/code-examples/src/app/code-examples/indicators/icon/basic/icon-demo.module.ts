import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/indicators';

import { IconDemoComponent } from './icon-demo.component';

@NgModule({
  imports: [CommonModule, SkyIconModule],
  declarations: [IconDemoComponent],
  exports: [IconDemoComponent],
})
export class IconDemoModule {}
