import {
  NgModule
} from '@angular/core';
 import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';
import {
  SkyListViewGridResourcesProvider
} from '../../plugin-resources/list-view-grid-resources-provider';
 @NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyListViewGridResourcesProvider,
    multi: true
  }]
})
export class SkyListViewGridResourcesModule { }
