import { NgModule } from '@angular/core';

import { SkyViewkeeperDirective } from './viewkeeper.directive';

/**
 * @docsIncludeIds SkyViewkeeperDirective, SkyViewkeeperService, SkyViewkeeperOptions, SkyViewkeeperHostOptions
 */
@NgModule({
  declarations: [SkyViewkeeperDirective],
  exports: [SkyViewkeeperDirective],
})
export class SkyViewkeeperModule {}
