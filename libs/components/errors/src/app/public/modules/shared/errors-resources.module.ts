import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyErrorsResourcesProvider
} from '../../plugin-resources/errors-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyErrorsResourcesProvider,
    multi: true
  }]
})
export class SkyErrorsResourcesModule { }
