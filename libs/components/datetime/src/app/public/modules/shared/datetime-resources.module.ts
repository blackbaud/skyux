import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyDateTimeResourcesProvider
} from '../../plugin-resources/datetime-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyDateTimeResourcesProvider,
    multi: true
  }]
})
export class SkyDateTimeResourcesModule { }
