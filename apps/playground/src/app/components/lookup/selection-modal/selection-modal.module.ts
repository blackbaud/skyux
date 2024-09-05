import { NgModule } from '@angular/core';

import { SelectionModalAddItemModalComponent } from './selection-modal-add-item-modal.component';
import { SelectionModalRoutingModule } from './selection-modal-routing.module';
import { SelectionModalComponent } from './selection-modal.component';

@NgModule({
  declarations: [SelectionModalComponent],
  imports: [SelectionModalRoutingModule, SelectionModalAddItemModalComponent],
})
export class SelectionModalModule {
  public static routes = SelectionModalRoutingModule.routes;
}
