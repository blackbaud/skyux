import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyMediaQueryModule } from '@skyux/core';

import { StacheNavModule } from '../nav/nav.module';
import { StacheResourcesModule } from '../shared/stache-resources.module';
import { StacheWindowRef } from '../shared/window-ref';

import { StacheSidebarWrapperComponent } from './sidebar-wrapper.component';
import { StacheSidebarComponent } from './sidebar.component';

@NgModule({
  declarations: [StacheSidebarComponent, StacheSidebarWrapperComponent],
  imports: [
    CommonModule,
    SkyMediaQueryModule,
    StacheNavModule,
    StacheResourcesModule,
  ],
  exports: [StacheSidebarComponent, StacheSidebarWrapperComponent],
  providers: [StacheWindowRef],
})
export class StacheSidebarModule {}
