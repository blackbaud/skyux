import { NgModule } from '@angular/core';
import { _SkyAnimationEndHandlerDirective } from '@skyux/core';
import { SkyWaitModule } from '@skyux/indicators';

import { SkyLayoutResourcesModule } from '../shared/sky-layout-resources.module';

import { SkyInlineDeleteComponent } from './inline-delete.component';

@NgModule({
  declarations: [SkyInlineDeleteComponent],
  imports: [
    _SkyAnimationEndHandlerDirective,
    SkyLayoutResourcesModule,
    SkyWaitModule,
  ],
  exports: [SkyInlineDeleteComponent],
})
export class SkyInlineDeleteModule {}
