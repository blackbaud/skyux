import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyAlertModule } from '@skyux/indicators';

import { AlertDemoComponent } from './alert-demo.component';

@NgModule({
  imports: [CommonModule, SkyAlertModule],
  declarations: [AlertDemoComponent],
  exports: [AlertDemoComponent],
})
export class AlertDemoModule {}
