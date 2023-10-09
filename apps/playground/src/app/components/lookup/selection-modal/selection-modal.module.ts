import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SelectionModalRoutingModule } from './selection-modal-routing.module';
import { SelectionModalComponent } from './selection-modal.component';

@NgModule({
  declarations: [SelectionModalComponent],
  imports: [SelectionModalRoutingModule, CommonModule],
})
export class SelectionModalModule {
  public static routes = SelectionModalRoutingModule.routes;
}
