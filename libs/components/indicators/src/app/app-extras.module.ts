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

const modules = [
  SkyAlertModule,
  SkyChevronModule,
  SkyHelpInlineModule,
  SkyIconModule,
  SkyKeyInfoModule,
  SkyLabelModule,
  SkyTextHighlightModule,
  SkyTokensModule,
  SkyWaitModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export class AppExtrasModule { }
