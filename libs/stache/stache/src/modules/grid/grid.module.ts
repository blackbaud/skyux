import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheRowComponent } from './row.component';
import { StacheColumnComponent } from './column.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    StacheRowComponent,
    StacheColumnComponent
  ],
  exports: [
    StacheRowComponent,
    StacheColumnComponent
  ]
})
export class StacheGridModule {}
