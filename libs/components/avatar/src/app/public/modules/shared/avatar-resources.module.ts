import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyAvatarResourcesProvider
} from '../../plugin-resources/avatar-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyAvatarResourcesProvider,
    multi: true
  }]
})
export class SkyAvatarResourcesModule { }
