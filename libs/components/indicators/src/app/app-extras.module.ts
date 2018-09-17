import {
  NgModule
} from '@angular/core';

import {
  SkyActionButtonModule,
  SkyChevronModule,
  SkyHelpInlineModule,
  SkyIconModule,
  SkyLabelModule,
  SkyProgressIndicatorModule,
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
    SkyProgressIndicatorModule,
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
    SkyProgressIndicatorModule,
    SkyTextHighlightModule,
    SkyTokensModule,
    SkyWaitModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
