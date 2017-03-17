import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StacheMenuComponent } from './menu.component';

@NgModule({
  declarations: [
    StacheMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    StacheMenuComponent
  ]
})
export class StacheMenuModule {}
