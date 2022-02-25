import { NgModule } from '@angular/core';

import { SkyAppWindowRef, SkyDynamicComponentService } from '@skyux/core';

/**
 * @internal
 * @deprecated This module can be removed after we upgrade SKY UX development dependencies to version 5.
 */
@NgModule({
  providers: [SkyAppWindowRef, SkyDynamicComponentService],
})
export class SkyA11yForRootCompatModule {}
