import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyMediaResourcesProvider
} from '../../plugin-resources/media-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyMediaResourcesProvider,
    multi: true
  }]
})
export class SkyMediaResourcesModule { }
