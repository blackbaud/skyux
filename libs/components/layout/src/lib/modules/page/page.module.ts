import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyPageComponent } from './page.component';

@NgModule({
  declarations: [SkyPageComponent],
  imports: [CommonModule],
  exports: [SkyPageComponent],
})
export class SkyPageModule {}
