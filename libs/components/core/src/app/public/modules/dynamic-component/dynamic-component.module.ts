//#region imports

import {
  NgModule
} from '@angular/core';

import {
  SkyWindowRefService
} from '../window';

import {
  SkyDynamicComponentService
} from './dynamic-component.service';

//#endregion

/**
 * Provides services required to create dynamic components on the page.
 */
@NgModule({
  providers: [
    SkyWindowRefService,
    SkyDynamicComponentService
  ]
})
export class SkyDynamicComponentModule { }
