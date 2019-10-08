import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS,
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyAngularTreeResourcesProvider
} from '../../plugin-resources/sky-angular-tree-resources-provider';

@NgModule({
  exports: [
    SkyI18nModule
  ],
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyAngularTreeResourcesProvider,
    multi: true
  }]
})
export class SkyAngularTreeResourcesModule { }
