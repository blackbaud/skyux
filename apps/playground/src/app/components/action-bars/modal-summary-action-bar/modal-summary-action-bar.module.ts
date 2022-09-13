import { NgModule } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { SkyModalModule } from '@skyux/modals';

import { ModalSummaryActionBarModalComponent } from './modal-summary-action-bar-modal.component';
import { ModalSummaryActionBarRoutingModule } from './modal-summary-action-bar-routing.module';
import { ModalSummaryActionBarComponent } from './modal-summary-action-bar.component';

@NgModule({
  declarations: [
    ModalSummaryActionBarComponent,
    ModalSummaryActionBarModalComponent,
  ],
  imports: [
    SkyKeyInfoModule,
    SkySummaryActionBarModule,
    SkyModalModule,
    ModalSummaryActionBarRoutingModule,
  ],
})
export class ModalSummaryActionBarModule {
  public static routes = ModalSummaryActionBarRoutingModule.routes;
}
