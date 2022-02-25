import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyToggleSwitchModule } from 'projects/forms/src/public-api';

import { ToggleSwitchDemoComponent } from './toggle-switch-demo.component';

@NgModule({
  imports: [CommonModule, SkyToggleSwitchModule],
  declarations: [ToggleSwitchDemoComponent],
  exports: [ToggleSwitchDemoComponent],
})
export class SkyToggleSwitchDemoModule {}
