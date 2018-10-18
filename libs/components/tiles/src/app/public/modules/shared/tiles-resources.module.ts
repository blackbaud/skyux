import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyTilesResourcesProvider
} from '../../plugin-resources/tiles-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyTilesResourcesProvider,
    multi: true
  }]
})
export class SkyTilesResourcesModule { }
