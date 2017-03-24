import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheNavModule } from '../nav';
import { StacheSidebarComponent } from './sidebar.component';

@NgModule({
  declarations: [
    StacheSidebarComponent
  ],
  imports: [
    CommonModule,
    StacheNavModule
  ],
  exports: [
    StacheSidebarComponent
  ]
})
export class StacheSidebarModule {}
