import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyIndicatorsResourcesProvider
} from '../../plugin-resources/indicators-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyIndicatorsResourcesProvider,
    multi: true
  }]
})
export class SkyIndicatorsResourcesModule { }
