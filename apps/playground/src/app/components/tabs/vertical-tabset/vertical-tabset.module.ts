import { NgModule } from '@angular/core';
import { SkyModalModule } from '@skyux/modals';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

import { VerticalTabsetModalComponent } from './vertical-tabset-modal.component';
import { VerticalTabsetRoutingModule } from './vertical-tabset-routing.module';
import { VerticalTabsetComponent } from './vertical-tabset.component';

@NgModule({
  declarations: [VerticalTabsetComponent, VerticalTabsetModalComponent],
  imports: [
    SkyModalModule,
    SkyVerticalTabsetModule,
    VerticalTabsetRoutingModule,
  ],
})
export class VerticalTabsetModule {}
