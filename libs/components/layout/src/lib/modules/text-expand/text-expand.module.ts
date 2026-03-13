import { NgModule } from '@angular/core';
import { _SkyAnimationExpandComponent } from '@skyux/core';

import { SkyTextExpandComponent } from './text-expand.component';

@NgModule({
  declarations: [SkyTextExpandComponent],
  exports: [SkyTextExpandComponent],
  imports: [_SkyAnimationExpandComponent],
})
export class SkyTextExpandModule {}
