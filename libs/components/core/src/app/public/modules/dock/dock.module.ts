import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyDynamicComponentModule
} from '../dynamic-component/dynamic-component.module';

import {
  MutationObserverService
} from '../mutation/mutation-observer-service';

import {
  SkyDockComponent
} from './dock.component';

import {
  SkyDockService
} from './dock.service';

@NgModule({
  imports: [
    CommonModule,
    SkyDynamicComponentModule
  ],
  declarations: [
    SkyDockComponent
  ],
  entryComponents: [
    SkyDockComponent
  ],
  providers: [
    MutationObserverService,
    SkyDockService
  ]
})
export class SkyDockModule { }
