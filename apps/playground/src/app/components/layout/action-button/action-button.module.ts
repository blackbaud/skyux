import { NgModule } from '@angular/core';
import { SkyActionButtonModule } from '@skyux/layout';

import { ActionButtonRoutingModule } from './action-button-routing.module';
import { ActionButtonComponent } from './basic/action-button.component';

@NgModule({
  declarations: [ActionButtonComponent],
  imports: [ActionButtonRoutingModule, SkyActionButtonModule],
})
export class ActionButtonModule {}
