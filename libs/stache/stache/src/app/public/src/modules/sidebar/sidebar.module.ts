import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheNavModule } from '../nav';
import { StacheSidebarComponent } from './sidebar.component';
import { StacheLinkModule } from '../link';

@NgModule({
  declarations: [
    StacheSidebarComponent
  ],
  imports: [
    CommonModule,
    StacheNavModule,
    StacheLinkModule
  ],
  exports: [
    StacheSidebarComponent
  ]
})
export class StacheSidebarModule { }
