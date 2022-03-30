import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAppWindowRef } from '@skyux/core';

import { SkyWaitModule } from '../wait.module';

import { SkyWaitTestComponent } from './wait.component.fixture';

@NgModule({
  declarations: [SkyWaitTestComponent],
  imports: [CommonModule, SkyWaitModule],
  providers: [SkyAppWindowRef],
})
export class SkyWaitFixturesModule {}
