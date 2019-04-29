import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS,
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyListsResourcesProvider
} from '../../plugin-resources/lists-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyListsResourcesProvider,
    multi: true
  }],
  exports: [
    SkyI18nModule
  ]
})
export class SkyListsResourcesModule { }
