import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyLayoutResourcesProvider
} from '../../plugin-resources/layout-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyLayoutResourcesProvider,
    multi: true
  }]
})
export class SkyLayoutResourcesModule { }
