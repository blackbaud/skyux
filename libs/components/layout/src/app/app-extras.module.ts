import {
  NgModule
} from '@angular/core';

import {
  SkyActionButtonModule,
  SkyCardModule,
  SkyDefinitionListModule,
  SkyFluidGridModule,
  SkyPageSummaryModule,
  SkyTextExpandModule,
  SkyTextExpandRepeaterModule,
  SkyToolbarModule
 } from './public';

 import {
   SkyAvatarModule
 } from '@skyux/avatar';

 import {
   SkyAlertModule,
   SkyKeyInfoModule,
   SkyLabelModule,
   SkyIconModule
 } from '@skyux/indicators';

@NgModule({
  imports: [
    SkyActionButtonModule,
    SkyAlertModule,
    SkyAvatarModule,
    SkyCardModule,
    SkyDefinitionListModule,
    SkyFluidGridModule,
    SkyIconModule,
    SkyKeyInfoModule,
    SkyPageSummaryModule,
    SkyTextExpandModule,
    SkyTextExpandRepeaterModule,
    SkyToolbarModule
  ],
  exports: [
    SkyActionButtonModule,
    SkyAlertModule,
    SkyAvatarModule,
    SkyCardModule,
    SkyDefinitionListModule,
    SkyFluidGridModule,
    SkyIconModule,
    SkyKeyInfoModule,
    SkyLabelModule,
    SkyPageSummaryModule,
    SkyTextExpandModule,
    SkyTextExpandRepeaterModule,
    SkyToolbarModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
