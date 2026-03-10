import { NgModule } from '@angular/core';
import { _SkyAnimationShowMoreComponent } from '@skyux/core';

import { SkyTextExpandComponent } from './text-expand.component';

@NgModule({
  declarations: [SkyTextExpandComponent],
  exports: [SkyTextExpandComponent],
  imports: [_SkyAnimationShowMoreComponent],
})
export class SkyTextExpandModule {}
