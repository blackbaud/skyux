import {
  NgModule
} from '@angular/core';

import {
  DynamicComponentDemoExampleComponent
} from './demos/dynamic-component/dynamic-component-example.component';

import {
  SkyDynamicComponentModule,
  SkyMediaQueryModule,
  SkyNumericModule
} from './public';

@NgModule({
  exports: [
    SkyDynamicComponentModule,
    SkyMediaQueryModule,
    SkyNumericModule
  ],
  entryComponents: [
    DynamicComponentDemoExampleComponent
  ]
})
export class AppExtrasModule { }
