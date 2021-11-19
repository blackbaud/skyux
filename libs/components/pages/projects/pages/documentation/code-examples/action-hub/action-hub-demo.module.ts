import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyActionHubModule } from '@skyux/pages';

import { ActionHubDemoComponent } from './action-hub-demo.component';

@NgModule({
  declarations: [ActionHubDemoComponent],
  exports: [ActionHubDemoComponent],
  imports: [CommonModule, SkyActionHubModule],
})
export class ActionHubDemoModule {}
