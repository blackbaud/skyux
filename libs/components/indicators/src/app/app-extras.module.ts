import {
  NgModule
} from '@angular/core';

import {
  SkyAlertModule,
  SkyChevronModule,
  SkyHelpInlineModule,
  SkyIconModule,
  SkyKeyInfoModule,
  SkyLabelModule,
  SkyTextHighlightModule,
  SkyTokensModule,
  SkyWaitModule
} from './public';

@NgModule({
  exports: [
    SkyAlertModule,
    SkyChevronModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyKeyInfoModule,
    SkyLabelModule,
    SkyTextHighlightModule,
    SkyTokensModule,
    SkyWaitModule
  ]
})
export class AppExtrasModule { }
