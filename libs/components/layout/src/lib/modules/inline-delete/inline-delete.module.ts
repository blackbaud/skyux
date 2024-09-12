import { NgModule } from '@angular/core';
import { SkyWaitModule } from '@skyux/indicators';

import { SkyLayoutResourcesModule } from '../shared/sky-layout-resources.module';

import { SkyInlineDeleteComponent } from './inline-delete.component';

@NgModule({
  declarations: [SkyInlineDeleteComponent],
  imports: [SkyLayoutResourcesModule, SkyWaitModule],
  exports: [SkyInlineDeleteComponent],
})
export class SkyInlineDeleteModule {}
