import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheNavModule } from '../nav';
import { StacheSidebarComponent } from './sidebar.component';
import { StacheSidebarWrapperComponent } from './sidebar-wrapper.component';
import { StacheLinkModule } from '../link';
import {
  SkyAppRuntimeModule
} from '@blackbaud/skyux-builder/runtime';

@NgModule({
  declarations: [
    StacheSidebarComponent,
    StacheSidebarWrapperComponent
  ],
  imports: [
    CommonModule,
    StacheNavModule,
    StacheLinkModule,
    SkyAppRuntimeModule
  ],
  exports: [
    StacheSidebarComponent,
    StacheSidebarWrapperComponent
  ]
})
export class StacheSidebarModule { }
