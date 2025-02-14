import { NgModule } from '@angular/core';

import { SkySimpleGridColumnComponent } from './simple-grid-column.component';
import { SkySimpleGridComponent } from './simple-grid.component';

@NgModule({
  imports: [SkySimpleGridComponent, SkySimpleGridColumnComponent],
  exports: [SkySimpleGridComponent, SkySimpleGridColumnComponent],
})
export class SkySimpleGridModule {}
