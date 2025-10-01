import { NgModule } from '@angular/core';

import { SkyFilterBarComponent } from './filter-bar.component';
import { SkyFilterItemLookupComponent } from './filter-items/filter-item-lookup.component';
import { SkyFilterItemModalComponent } from './filter-items/filter-item-modal.component';

@NgModule({
  imports: [
    SkyFilterBarComponent,
    SkyFilterItemModalComponent,
    SkyFilterItemLookupComponent,
  ],
  exports: [
    SkyFilterBarComponent,
    SkyFilterItemModalComponent,
    SkyFilterItemLookupComponent,
  ],
})
export class SkyFilterBarModule {}
