import {
  NgModule
} from '@angular/core';

import {
  SkyAppWindowRef
} from '../window/window-ref';

import {
  SkyDynamicComponentService
} from './dynamic-component.service';

/**
 * Provides services required to create dynamic components on the page.
 */
@NgModule({
  providers: [
    SkyAppWindowRef,
    SkyDynamicComponentService
  ]
})
export class SkyDynamicComponentModule { }
