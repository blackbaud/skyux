import {
  NgModule
} from '@angular/core';

import {
  SkyI18nModule,
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyDocsToolsResourcesProvider
} from '../../plugin-resources/docs-tools-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyDocsToolsResourcesProvider,
    multi: true
  }],
  exports: [
    SkyI18nModule
  ]
})
export class SkyDocsToolsResourcesModule { }
