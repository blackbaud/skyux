import {
  NgModule
} from '@angular/core';

import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';

import {
  SkyTextEditorResourcesProvider
} from '../../plugin-resources/text-editor-resources-provider';

@NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyTextEditorResourcesProvider,
    multi: true
  }]
})
export class SkyTextEditorResourcesModule { }
