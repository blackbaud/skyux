import {
  NgModule
} from '@angular/core';

import {
  SkyI18nModule,
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyAgGridResourcesProvider
} from '../../plugin-resources/ag-grid-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyAgGridResourcesProvider,
    multi: true
  }],
  exports: [
    SkyI18nModule
  ]
})
export class SkyAgGridResourcesModule { }
