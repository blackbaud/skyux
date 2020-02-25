import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  DynamicComponentDemoExampleComponent
} from './demos/dynamic-component/dynamic-component-example.component';

import {
  SkyCoreAdapterModule,
  SkyDynamicComponentModule,
  SkyMediaQueryModule,
  SkyNumericModule,
  SkyViewkeeperModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCoreAdapterModule,
    SkyDynamicComponentModule,
    SkyMediaQueryModule,
    SkyNumericModule,
    SkyViewkeeperModule
  ],
  entryComponents: [
    DynamicComponentDemoExampleComponent
  ]
})
export class AppExtrasModule { }
