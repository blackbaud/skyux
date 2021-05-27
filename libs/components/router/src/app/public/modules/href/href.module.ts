import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAppWindowRef } from '@skyux/core';

import { SkyHrefDirective } from './href.directive';

@NgModule({
  declarations: [SkyHrefDirective],
  exports: [SkyHrefDirective],
  imports: [CommonModule],
  providers: [SkyAppWindowRef]
})
export class SkyHrefModule {}
