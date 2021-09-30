import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyHrefDirective } from './href.directive';

@NgModule({
  declarations: [SkyHrefDirective],
  exports: [SkyHrefDirective],
  imports: [CommonModule]
})
export class SkyHrefModule {}
