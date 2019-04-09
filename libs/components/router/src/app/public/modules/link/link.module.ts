import {
  NgModule
} from '@angular/core';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyAppLinkDirective
} from './link.directive';

import {
  SkyAppLinkExternalDirective
} from './link-external.directive';

@NgModule({
  declarations: [
    SkyAppLinkDirective,
    SkyAppLinkExternalDirective
  ],
  exports: [
    SkyAppLinkDirective,
    SkyAppLinkExternalDirective
  ],
  providers: [
    SkyAppWindowRef
  ]
})
/* istanbul ignore next */
export class SkyAppLinkModule { }
