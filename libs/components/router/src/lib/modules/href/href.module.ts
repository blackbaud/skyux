import { NgModule } from '@angular/core';

import { SkyHrefDirective } from './href.directive';

/**
 * @docsIncludeIds SkyHrefDirective, SkyHrefResolver, SkyHrefResolverService, SkyHrefChange, SkyHrefQueryParams, SkyHrefResolverArgs, SkyHref, SkyHrefHarness, SkyHrefTestingModule
 */
@NgModule({
  declarations: [SkyHrefDirective],
  exports: [SkyHrefDirective],
})
export class SkyHrefModule {}
