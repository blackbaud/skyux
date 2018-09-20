import {
  NgModule
} from '@angular/core';

import {
  SkyChevronModule,
  SkyHelpInlineModule,
  SkyIconModule,
  SkyLabelModule,
  SkyTextHighlightModule,
  SkyTokensModule,
  SkyWaitModule
} from './public';

@NgModule({
  imports: [
    SkyChevronModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyLabelModule,
    SkyTextHighlightModule,
    SkyTokensModule,
    SkyWaitModule
  ],
  exports: [
    SkyChevronModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyLabelModule,
    SkyTextHighlightModule,
    SkyTokensModule,
    SkyWaitModule
  ]
})
export class AppExtrasModule { }
