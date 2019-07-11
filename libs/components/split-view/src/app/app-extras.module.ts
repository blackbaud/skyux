import {
  NgModule
} from '@angular/core';

import {
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkyConfirmModule
} from '@skyux/modals';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkySplitViewModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyConfirmModule,
    SkySplitViewModule,
    SkyRepeaterModule
  ]
})
export class AppExtrasModule { }
