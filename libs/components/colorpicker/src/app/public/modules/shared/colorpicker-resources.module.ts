import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyColorpickerResourcesProvider
} from '../../plugin-resources/colorpicker-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyColorpickerResourcesProvider,
    multi: true
  }]
})
export class SkyColorpickerResourcesModule { }
