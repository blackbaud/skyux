import { NgModule } from '@angular/core';

import { SkyNumericPipe } from './numeric.pipe';

@NgModule({
  imports: [SkyNumericPipe],
  exports: [SkyNumericPipe],
})
export class SkyNumericModule {}
