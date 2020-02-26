import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  RouterModule
} from '@angular/router';

import {
  SkyDynamicComponentModule
} from '../dynamic-component/dynamic-component.module';

import {
  SkyAppWindowRef
} from '../window/window-ref';

import {
  SkyOverlayAdapterService
} from './overlay-adapter.service';

import {
  SkyOverlayHostComponent
} from './overlay-host.component';

import {
  SkyOverlayComponent
} from './overlay.component';

import {
  SkyOverlayService
} from './overlay.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SkyDynamicComponentModule
  ],
  declarations: [
    SkyOverlayComponent,
    SkyOverlayHostComponent
  ],
  entryComponents: [
    SkyOverlayComponent,
    SkyOverlayHostComponent
  ],
  providers: [
    SkyAppWindowRef,
    SkyOverlayAdapterService,
    SkyOverlayService
  ]
})
export class SkyOverlayModule { }
