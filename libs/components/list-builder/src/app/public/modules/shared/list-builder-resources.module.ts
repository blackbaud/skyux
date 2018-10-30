import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyListBuilderResourcesProvider
} from '../../plugin-resources/list-builder-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyListBuilderResourcesProvider,
    multi: true
  }]
})
export class SkyListBuilderResourcesModule { }
