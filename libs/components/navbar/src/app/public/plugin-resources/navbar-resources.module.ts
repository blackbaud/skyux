import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyNavbarResourcesProvider
} from './navbar-resources-provider';

@NgModule({
  providers: [
    {
      provide: SKY_LIB_RESOURCES_PROVIDERS,
      useClass: SkyNavbarResourcesProvider,
      multi: true
    }
  ]
})
export class SkyNavbarResourcesModule {

}
