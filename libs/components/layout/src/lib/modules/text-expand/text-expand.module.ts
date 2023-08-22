import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyModalModule } from '@skyux/modals';

import { SkyLayoutResourcesModule } from '../shared/sky-layout-resources.module';

import { SkyTextExpandModalComponent } from './text-expand-modal.component';
import { SkyTextExpandComponent } from './text-expand.component';

@NgModule({
  declarations: [SkyTextExpandComponent, SkyTextExpandModalComponent],
  imports: [SkyLayoutResourcesModule, SkyModalModule, CommonModule],
  exports: [SkyTextExpandComponent],
})
export class SkyTextExpandModule {}
