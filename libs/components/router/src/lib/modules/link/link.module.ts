import { NgModule } from '@angular/core';

import { SkyAppLinkExternalDirective } from './link-external.directive';
import { SkyAppLinkDirective } from './link.directive';

/**
 * @docsIncludeIds SkyAppLinkDirective, SkyAppLinkExternalDirective, SkyAppLinkQueryParams
 */
@NgModule({
  declarations: [SkyAppLinkDirective, SkyAppLinkExternalDirective],
  exports: [SkyAppLinkDirective, SkyAppLinkExternalDirective],
})
/* istanbul ignore next */
export class SkyAppLinkModule {}
