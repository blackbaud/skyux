import { NgModule } from '@angular/core';

import { SkyGridColumnComponent } from './grid-column.component';
import { SkyGridComponent } from './grid.component';

@NgModule({
  imports: [SkyGridComponent, SkyGridColumnComponent],
  exports: [SkyGridComponent, SkyGridColumnComponent],
})
export class SkyGridModule {}
