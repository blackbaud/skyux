import { NgModule } from '@angular/core';

import { SkyWaitComponent } from './wait.component';

/**
 * @docsIncludeIds SkyWaitComponent, SkyWaitService, SkyWaitHarness, SkyWaitHarnessFilters
 */
@NgModule({
  imports: [SkyWaitComponent],
  exports: [SkyWaitComponent],
})
export class SkyWaitModule {}
