import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyA11yResourcesProvider
} from '../../plugin-resources/a11y-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyA11yResourcesProvider,
    multi: true
  }]
})
export class SkyA11yResourcesModule { }
