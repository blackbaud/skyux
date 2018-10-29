import {
  NgModule
} from '@angular/core';
 import {
  SKY_LIB_RESOURCES_PROVIDERS
} from '@skyux/i18n';
import {
  SkyListViewChecklistResourcesProvider
} from '../../plugin-resources/list-view-checklist-resources-provider';
 @NgModule({
  providers: [{
    provide: SKY_LIB_RESOURCES_PROVIDERS,
    useClass: SkyListViewChecklistResourcesProvider,
    multi: true
  }]
})
export class SkyListViewChecklistResourcesModule { }
