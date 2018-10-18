import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyToastResourcesProvider
} from '../../plugin-resources/toast-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyToastResourcesProvider,
    multi: true
  }]
})
export class SkyToastResourcesModule { }
