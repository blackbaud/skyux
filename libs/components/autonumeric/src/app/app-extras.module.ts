import {
  NgModule
} from '@angular/core';

import { SkyAutonumericModule } from './public/library.module';
import { SkyAutonumericConfig } from './public/modules/autonumeric/autonumeric-config';

@NgModule({
  imports: [
    SkyAutonumericModule
  ],
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
