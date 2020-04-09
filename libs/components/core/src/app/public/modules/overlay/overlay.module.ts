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
  SkyCoreAdapterModule
} from '../adapter-service/adapter.module';

import {
  SkyAppWindowRef
} from '../window/window-ref';

import {
  SkyOverlayAdapterService
} from './overlay-adapter.service';

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
    SkyCoreAdapterModule
  ],
  declarations: [
    SkyOverlayComponent
  ],
  entryComponents: [
    SkyOverlayComponent
  ],
  providers: [
    SkyAppWindowRef,
    SkyOverlayAdapterService,
    SkyOverlayService
  ]
})
export class SkyOverlayModule { }
