import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyProgressIndicatorResourcesProvider
} from '../../plugin-resources/progress-indicator-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyProgressIndicatorResourcesProvider,
    multi: true
  }]
})
export class SkyProgressIndicatorResourcesModule { }
