import {
  NgModule
} from '@angular/core';

import {
  SkyAutonumericConfig,
  SkyAutonumericModule
} from './public';

@NgModule({
  exports: [
    SkyAutonumericModule
  ],
  providers: [
    {
      provide: SkyAutonumericConfig,
      useValue: new SkyAutonumericConfig('dollar', {
        decimalPlaces: 5
      })
    }
  ]
})
export class AppExtrasModule { }
