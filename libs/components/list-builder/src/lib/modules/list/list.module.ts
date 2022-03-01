import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyListComponent } from './list.component';

@NgModule({
  declarations: [SkyListComponent],
  imports: [CommonModule],
  exports: [SkyListComponent],
})
export class SkyListModule {}
