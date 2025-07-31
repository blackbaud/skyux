import { NgModule } from '@angular/core';

import { SkyFilterBarItemComponent } from './filter-bar-item.component';
import { SkyFilterBarComponent } from './filter-bar.component';

@NgModule({
  imports: [SkyFilterBarComponent, SkyFilterBarItemComponent],
  exports: [SkyFilterBarComponent, SkyFilterBarItemComponent],
})
export class SkyFilterBarModule {}
