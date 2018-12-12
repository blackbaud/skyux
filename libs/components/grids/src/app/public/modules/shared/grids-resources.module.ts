import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS,
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyGridsResourcesProvider
} from '../../plugin-resources/grids-resources-provider';

@NgModule({
  exports: [
    SkyI18nModule
  ],
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyGridsResourcesProvider,
    multi: true
  }]
})
export class SkyGridsResourcesModule { }
