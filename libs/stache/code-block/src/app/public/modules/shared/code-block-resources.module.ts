import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyCodeBlockResourcesProvider
} from '../../plugin-resources/code-block-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyCodeBlockResourcesProvider,
    multi: true
  }]
})
export class SkyCodeBlockResourcesModule { }
