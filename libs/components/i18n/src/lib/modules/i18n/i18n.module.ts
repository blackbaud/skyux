import { SkyLibResourcesPipe } from './lib-resources.pipe';
import { SkyAppResourcesPipe } from './resources.pipe';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [SkyAppResourcesPipe, SkyLibResourcesPipe],
  exports: [SkyAppResourcesPipe, SkyLibResourcesPipe],
})
export class SkyI18nModule {}
