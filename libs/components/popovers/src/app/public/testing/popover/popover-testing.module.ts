import {
  NgModule
} from '@angular/core';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyPopoverModule
} from '@skyux/popovers';

@NgModule({
  exports: [
    SkyPopoverModule,

    // The noop animations module needs to be loaded last to avoid
    // subsequent modules adding animations and overriding this.
    NoopAnimationsModule
  ]
})
export class SkyPopoverTestingModule { }
