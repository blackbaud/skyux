import { NgModule } from '@angular/core';

import { ModalSummaryActionBarRoutingModule } from './modal-summary-action-bar-routing.module';
import { ModalSummaryActionBarComponent } from './modal-summary-action-bar.component';

@NgModule({
  declarations: [ModalSummaryActionBarComponent],
  imports: [ModalSummaryActionBarRoutingModule],
})
export class ModalSummaryActionBarModule {
  public static routes = ModalSummaryActionBarRoutingModule.routes;
}
