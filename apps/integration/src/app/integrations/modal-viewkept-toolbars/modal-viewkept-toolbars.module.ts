import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyViewkeeperModule } from '@skyux/core';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';
import { SkyModalModule } from '@skyux/modals';

import { ModalViewkeptToolbarsModalComponent } from './modal-viewkept-toolbars-modal.component';
import { ModalViewkeptToolbarsRoutingModule } from './modal-viewkept-toolbars-routing-module';
import { ModalViewkeptToolbarsComponent } from './modal-viewkept-toolbars.component';

@NgModule({
  declarations: [
    ModalViewkeptToolbarsComponent,
    ModalViewkeptToolbarsModalComponent,
  ],
  imports: [
    CommonModule,
    SkyCheckboxModule,
    SkyModalModule,
    SkySearchModule,
    SkyToolbarModule,
    SkyViewkeeperModule,
    ModalViewkeptToolbarsRoutingModule,
  ],
})
export class ModalViewkeptToolbarsModule {
  public static routes = ModalViewkeptToolbarsRoutingModule.routes;
}
