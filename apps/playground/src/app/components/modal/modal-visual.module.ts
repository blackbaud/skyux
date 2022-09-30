import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyModalModule } from '@skyux/modals';
import { SkyTilesModule } from '@skyux/tiles';

import { ModalCloseConfirmComponent } from './modal-close-confirm.component';
import { ModalContentAutofocusComponent } from './modal-content-autofocus.component';
import { ModalContentDemoComponent } from './modal-content-demo.component';
import { ModalDemoComponent } from './modal-demo.component';
import { ModalFormDemoComponent } from './modal-form-demo.component';
import { ModalFullPageDemoComponent } from './modal-fullpage-demo.component';
import { ModalLargeDemoComponent } from './modal-large-demo.component';
import { ModalTiledDemoComponent } from './modal-tiled-demo.component';
import { ModalVisualRoutingModule } from './modal-visual-routing.module';
import { ModalVisualComponent } from './modal-visual.component';

@NgModule({
  declarations: [
    ModalCloseConfirmComponent,
    ModalContentAutofocusComponent,
    ModalContentDemoComponent,
    ModalDemoComponent,
    ModalFormDemoComponent,
    ModalFullPageDemoComponent,
    ModalLargeDemoComponent,
    ModalTiledDemoComponent,
    ModalVisualComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyInputBoxModule,
    SkyTilesModule,
    SkyModalModule,
    ModalVisualRoutingModule,
    SkyHelpInlineModule,
  ],
})
export class ModalVisualModule {
  public static routes = ModalVisualRoutingModule.routes;
}
