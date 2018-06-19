import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheNavModule } from '../nav';
import { StacheSidebarComponent } from './sidebar.component';
import { StacheSidebarWrapperComponent } from './sidebar-wrapper.component';
import { StacheLinkModule } from '../link';

@NgModule({
  declarations: [
    StacheSidebarComponent,
    StacheSidebarWrapperComponent
  ],
  imports: [
    CommonModule,
    StacheNavModule,
    StacheLinkModule
  ],
  exports: [
    StacheSidebarComponent,
    StacheSidebarWrapperComponent
  ]
})
export class StacheSidebarModule { }
