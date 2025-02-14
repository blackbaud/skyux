import { NgModule } from '@angular/core';

import { SkyShowcaseContentComponent } from './showcase-content.component';
import { SkyShowcaseComponent } from './showcase.component';

@NgModule({
  imports: [SkyShowcaseComponent, SkyShowcaseContentComponent],
  exports: [SkyShowcaseComponent, SkyShowcaseContentComponent],
})
export class SkyShowcaseModule {}
