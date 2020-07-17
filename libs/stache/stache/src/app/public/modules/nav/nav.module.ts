import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterModule
} from '@angular/router';

import {
  SkyRestrictedViewModule
} from '@blackbaud/skyux-lib-restricted-view';

import {
  StacheRouterLinkDirective
} from './link.directive';

import {
  StacheNavComponent
} from './nav.component';

import {
  StacheRouterModule
} from '../router/router.module';

import {
  StacheResourcesModule
} from '../shared/stache-resources.module';

import {
  StacheWindowRef
} from '../shared/window-ref';

import {
  StacheNavService
 } from './nav.service';

@NgModule({
  declarations: [
    StacheNavComponent,
    StacheRouterLinkDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    SkyRestrictedViewModule,
    StacheResourcesModule,
    StacheRouterModule
  ],
  exports: [
    StacheNavComponent,
    StacheRouterLinkDirective
  ],
  providers: [
    StacheNavService,
    StacheWindowRef
  ]
})
export class StacheNavModule { }
