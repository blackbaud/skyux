import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS,
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyLookupResourcesProvider
} from '../../plugin-resources/lookup-resources-provider';

@NgModule({
  exports: [
    SkyI18nModule
  ],
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyLookupResourcesProvider,
    multi: true
  }]
})
export class SkyLookupResourcesModule { }
