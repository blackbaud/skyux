import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/indicators';

import { SkyToastResourcesModule } from '../shared/sky-toast-resources.module';

import { SkyToastBodyComponent } from './toast-body.component';
import { SkyToastComponent } from './toast.component';
import { SkyToasterComponent } from './toaster.component';

@NgModule({
  declarations: [SkyToastBodyComponent, SkyToastComponent, SkyToasterComponent],
  imports: [CommonModule, SkyIconModule, SkyToastResourcesModule],
  exports: [SkyToastComponent],
})
export class SkyToastModule {}
