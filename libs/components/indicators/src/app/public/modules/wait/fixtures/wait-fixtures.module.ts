import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyWaitModule } from '../wait.module';
import { SkyWaitTestComponent } from './wait.component.fixture';

@NgModule({
  declarations: [
    SkyWaitTestComponent
  ],
  imports: [
    CommonModule,
    SkyWaitModule
  ],
  entryComponents: [
    SkyWaitTestComponent
  ]
})
export class SkyWaitFixturesModule { }
