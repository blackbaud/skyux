import {
  NgModule
} from '@angular/core';

import {
  SkyActionButtonModule,
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
    SkyActionButtonModule,
    SkyChevronModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyLabelModule,
    SkyTextHighlightModule,
    SkyTokensModule,
    SkyWaitModule
  ],
  exports: [
    SkyActionButtonModule,
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
