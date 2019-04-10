import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS,
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyInlineFormResourcesProvider
} from '../../plugin-resources/inline-form-resources-provider';

@NgModule({
  exports: [
    SkyI18nModule
  ],
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyInlineFormResourcesProvider,
    multi: true
  }]
})
export class SkyInlineFormResourcesModule { }
