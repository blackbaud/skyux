import { NgModule } from '@angular/core';

import { SkyAffixDirective } from './affix.directive';

@NgModule({
  imports: [SkyAffixDirective],
  exports: [SkyAffixDirective],
})
export class SkyAffixModule {}
