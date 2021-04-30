import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyActionHubModule } from '../../../modules/action-hub/action-hub.module';

import { ActionHubDemoComponent } from './action-hub-demo.component';

@NgModule({
  declarations: [ActionHubDemoComponent],
  exports: [ActionHubDemoComponent],
  imports: [CommonModule, SkyActionHubModule]
})
export class ActionHubDemoModule {}
