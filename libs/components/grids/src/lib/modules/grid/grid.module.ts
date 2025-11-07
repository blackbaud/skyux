import { NgModule } from '@angular/core';

import { SkyGridColumnComponent } from './grid-column.component';
import { SkyGridComponent } from './grid.component';

@NgModule({
  exports: [SkyGridColumnComponent, SkyGridComponent],
  imports: [SkyGridColumnComponent, SkyGridComponent],
})
export class SkyGridModule {}
