import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyPagesResourcesProvider
} from '../../plugin-resources/pages-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyPagesResourcesProvider,
    multi: true
  }]
})
export class SkyPagesResourcesModule { }
