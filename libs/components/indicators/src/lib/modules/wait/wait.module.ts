import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyIndicatorsResourcesModule } from '../shared/sky-indicators-resources.module';

import { SkyWaitPageComponent } from './wait-page.component';
import { SkyWaitComponent } from './wait.component';

@NgModule({
  declarations: [SkyWaitComponent, SkyWaitPageComponent],
  imports: [CommonModule, SkyIndicatorsResourcesModule],
  exports: [SkyWaitComponent],
})
export class SkyWaitModule {}
