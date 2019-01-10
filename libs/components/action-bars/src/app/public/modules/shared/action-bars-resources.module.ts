import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyActionBarsResourcesProvider
} from '../../plugin-resources/action-bars-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyActionBarsResourcesProvider,
    multi: true
  }]
})
export class SkyActionBarsResourcesModule { }
