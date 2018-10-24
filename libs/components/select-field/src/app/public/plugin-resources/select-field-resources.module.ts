import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkySelectFieldResourcesProvider
} from './select-field-resources-provider';

@NgModule({
  providers: [
    {
      provide: SKY_LIB_RESOURCES_PROVIDERS,
      useClass: SkySelectFieldResourcesProvider,
      multi: true
    }
  ]
})
export class SkySelectFieldResourcesModule {

}
