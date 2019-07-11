import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS,
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkySplitViewResourcesProvider
} from '../../plugin-resources/split-view-resources-provider';

@NgModule({
  exports: [
    SkyI18nModule
  ],
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkySplitViewResourcesProvider,
    multi: true
  }]
})
export class SkySplitViewResourcesModule { }
