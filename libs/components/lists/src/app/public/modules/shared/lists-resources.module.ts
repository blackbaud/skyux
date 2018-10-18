import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyListsResourcesProvider
} from '../../plugin-resources/lists-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyListsResourcesProvider,
    multi: true
  }]
})
export class SkyListsResourcesModule { }
