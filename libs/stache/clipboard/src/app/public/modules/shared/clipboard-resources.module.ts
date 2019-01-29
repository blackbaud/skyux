import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyClipboardResourcesProvider
} from '../../plugin-resources/clipboard-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyClipboardResourcesProvider,
    multi: true
  }]
})
export class SkyClipboardResourcesModule { }
