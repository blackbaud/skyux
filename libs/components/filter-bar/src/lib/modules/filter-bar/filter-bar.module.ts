import { NgModule } from '@angular/core';

import { SkyFilterBarComponent } from './filter-bar.component';
import { SkyFilterItemModalComponent } from './filter-item-modal.component';

@NgModule({
  imports: [SkyFilterBarComponent, SkyFilterItemModalComponent],
  exports: [SkyFilterBarComponent, SkyFilterItemModalComponent],
})
export class SkyFilterBarModule {}
