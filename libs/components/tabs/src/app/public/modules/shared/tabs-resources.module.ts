import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyTabsResourcesProvider
} from '../../plugin-resources/tabs-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyTabsResourcesProvider,
    multi: true
  }]
})
export class SkyTabsResourcesModule { }
