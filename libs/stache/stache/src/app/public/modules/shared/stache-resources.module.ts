import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS,
  SkyI18nModule
} from '@skyux/i18n';

import {
  StacheResourcesProvider
} from '../../plugin-resources/stache-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: StacheResourcesProvider,
    multi: true
  }],
  exports: [
    SkyI18nModule
  ]
})
export class StacheResourcesModule { }
