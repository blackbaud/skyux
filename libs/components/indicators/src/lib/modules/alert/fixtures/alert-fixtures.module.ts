import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyAlertModule } from '../alert.module';

import { AlertTestComponent } from './alert.component.fixture';

@NgModule({
  declarations: [AlertTestComponent],
  imports: [CommonModule, SkyAlertModule],
  exports: [AlertTestComponent],
})
export class AlertFixturesModule {}
