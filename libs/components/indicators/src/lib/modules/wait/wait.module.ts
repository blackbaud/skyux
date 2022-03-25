import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyI18nModule } from '@skyux/i18n';

import { SkyIndicatorsResourcesModule } from '../shared/sky-indicators-resources.module';

import { SkyWaitPageComponent } from './wait-page.component';
import { SkyWaitComponent } from './wait.component';

@NgModule({
  declarations: [SkyWaitComponent, SkyWaitPageComponent],
  imports: [CommonModule, SkyI18nModule, SkyIndicatorsResourcesModule],
  exports: [SkyWaitComponent],
})
export class SkyWaitModule {}
