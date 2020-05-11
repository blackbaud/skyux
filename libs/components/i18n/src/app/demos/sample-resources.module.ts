import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '../public/public_api';

import {
  SkySampleResourcesProvider
} from '../public/plugin-resources/sample-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkySampleResourcesProvider,
    multi: true
  }]
})
export class SkySampleResourcesModule { }
