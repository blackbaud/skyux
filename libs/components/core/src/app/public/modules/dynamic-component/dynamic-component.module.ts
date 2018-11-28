import {
  NgModule
} from '@angular/core';

import {
  SkyWindowRefService
} from '../window';

import {
  SkyDynamicComponentService
} from './dynamic-component.service';

@NgModule({
  providers: [
    SkyWindowRefService,
    SkyDynamicComponentService
  ]
})
export class SkyDynamicComponentModule { }
