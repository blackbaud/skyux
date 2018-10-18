import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyPopoversResourcesProvider
} from '../../plugin-resources/popovers-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyPopoversResourcesProvider,
    multi: true
  }]
})
export class SkyPopoversResourcesModule { }
