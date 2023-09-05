import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyWaitModule } from '@skyux/indicators';

import { SkyLayoutResourcesModule } from '../shared/sky-layout-resources.module';

import { SkyInlineDeleteComponent } from './inline-delete.component';

@NgModule({
  declarations: [SkyInlineDeleteComponent],
  imports: [CommonModule, SkyLayoutResourcesModule, SkyWaitModule],
  exports: [SkyInlineDeleteComponent],
})
export class SkyInlineDeleteModule {}
