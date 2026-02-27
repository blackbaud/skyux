import { NgModule } from '@angular/core';
import { SkyPhoneFieldModule } from '@skyux/phone-field';

/**
 * @internal
 */
@NgModule({
  exports: [
    SkyPhoneFieldModule,

    // The noop animations module needs to be loaded last to avoid
    // subsequent modules adding animations and overriding this.
    ],
})
export class SkyPhoneFieldTestingModule {}
