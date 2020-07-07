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
  SkyRestrictedViewAuthService
} from './restricted-view-auth.service';

import {
  SkyRestrictedViewComponent
} from './restricted-view.component';

import {
  SkyRestrictedViewDirective
} from './restricted-view.directive';

@NgModule({
  declarations: [
    SkyRestrictedViewComponent,
    SkyRestrictedViewDirective
  ],
  imports: [
    CommonModule
  ],
  providers: [
    SkyAuthTokenProvider,
    SkyRestrictedViewAuthService
  ],
  exports: [
    SkyRestrictedViewComponent,
    SkyRestrictedViewDirective
  ]
})
export class SkyRestrictedViewModule { }
