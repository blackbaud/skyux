import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyActionButtonModule } from 'projects/layout/src/public-api';

import { ActionButtonDemoComponent } from './action-button-demo.component';

@NgModule({
  imports: [CommonModule, SkyActionButtonModule],
  declarations: [ActionButtonDemoComponent],
  exports: [ActionButtonDemoComponent],
})
export class ActionButtonDemoModule {}
