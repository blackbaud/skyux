import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyModalsResourcesProvider
} from '../../plugin-resources/modals-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyModalsResourcesProvider,
    multi: true
  }]
})
export class SkyModalsResourcesModule { }
