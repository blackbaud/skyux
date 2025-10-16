import { NgModule } from '@angular/core';

import { SkyLibResourcesPipe } from './lib-resources.pipe';
import { SkyAppResourcesPipe } from './resources.pipe';

@NgModule({
  imports: [SkyAppResourcesPipe, SkyLibResourcesPipe],
  exports: [SkyAppResourcesPipe, SkyLibResourcesPipe],
})
export class SkyI18nModule {}
