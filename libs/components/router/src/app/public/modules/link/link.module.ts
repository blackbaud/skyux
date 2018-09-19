import {
  NgModule
} from '@angular/core';

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
  ]
})
/* istanbul ignore next */
export class SkyAppLinkModule { }
