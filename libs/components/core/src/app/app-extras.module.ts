import {
  NgModule
} from '@angular/core';

import {
  DynamicComponentDemoExampleComponent
} from './demos/dynamic-component/dynamic-component-example.component';

import {
  SkyCoreAdapterModule,
  SkyDynamicComponentModule,
  SkyMediaQueryModule,
  SkyNumericModule
} from './public';

@NgModule({
  exports: [
    SkyCoreAdapterModule,
    SkyDynamicComponentModule,
    SkyMediaQueryModule,
    SkyNumericModule
  ],
  entryComponents: [
    DynamicComponentDemoExampleComponent
  ]
})
export class AppExtrasModule { }
