import { NgModule } from '@angular/core';

import { SkyLibResourcesPipe } from './lib-resources.pipe';
import { SkyLibResourcesService } from './lib-resources.service';
import { SkyAppResourcesPipe } from './resources.pipe';

@NgModule({
  declarations: [SkyAppResourcesPipe, SkyLibResourcesPipe],
  exports: [SkyAppResourcesPipe, SkyLibResourcesPipe],
  providers: [SkyLibResourcesService],
})
export class SkyI18nModule {}
