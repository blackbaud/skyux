import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyPhoneFieldResourcesProvider
} from '../../plugin-resources/phone-field-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyPhoneFieldResourcesProvider,
    multi: true
  }]
})
export class SkyPhoneFieldResourcesModule { }
