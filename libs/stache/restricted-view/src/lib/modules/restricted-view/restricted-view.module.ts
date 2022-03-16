import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyAuthTokenProvider
} from '@skyux/http';

import {
  SkyAlertModule
} from '@skyux/indicators';

import {
  SkyRestrictedViewAuthService
} from './restricted-view-auth.service';

import {
  SkyRestrictedViewComponent
} from './restricted-view.component';

import {
  SkyRestrictedContentAlertComponent
} from './restricted-content-alert.component';

import {
  SkyRestrictedViewDirective
} from './restricted-view.directive';

@NgModule({
  declarations: [
    SkyRestrictedContentAlertComponent,
    SkyRestrictedViewComponent,
    SkyRestrictedViewDirective
  ],
  imports: [
    CommonModule,
    SkyAlertModule
  ],
  providers: [
    SkyAuthTokenProvider,
    SkyRestrictedViewAuthService
  ],
  exports: [
    SkyRestrictedContentAlertComponent,
    SkyRestrictedViewComponent,
    SkyRestrictedViewDirective
  ]
})
export class SkyRestrictedViewModule { }
