import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyFlyoutResourcesProvider
} from '../../plugin-resources/flyout-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyFlyoutResourcesProvider,
    multi: true
  }]
})
export class SkyFlyoutResourcesModule { }
