import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyFormsResourcesProvider
} from '../../plugin-resources/forms-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyFormsResourcesProvider,
    multi: true
  }]
})
export class SkyFormsResourcesModule { }
