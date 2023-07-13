import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule, SkyToggleSwitchModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyAutocompleteModule, SkyLookupModule } from '@skyux/lookup';
import { SkyModalModule } from '@skyux/modals';
import { SkyTilesModule } from '@skyux/tiles';

import { DataManagerModule } from '../../shared/data-manager/data-manager.module';
import { LipsumModule } from '../../shared/lipsum/lipsum.module';

import { ModalCloseConfirmComponent } from './modal-close-confirm.component';
import { ModalContentAutofocusComponent } from './modal-content-autofocus.component';
import { ModalContentDemoComponent } from './modal-content-demo.component';
import { ModalDemoComponent } from './modal-demo.component';
import { ModalDirtyComponent } from './modal-dirty.component';
import { ModalFormDemoComponent } from './modal-form-demo.component';
import { ModalFullPageDemoComponent } from './modal-full-page-demo.component';
import { ModalLookupComponent } from './modal-lookup.component';
import { ModalTiledDemoComponent } from './modal-tiled-demo.component';
import { ModalVisualRoutingModule } from './modal-visual-routing.module';
import { ModalVisualComponent } from './modal-visual.component';

@NgModule({
  declarations: [
    ModalCloseConfirmComponent,
    ModalContentAutofocusComponent,
    ModalContentDemoComponent,
    ModalDemoComponent,
    ModalDirtyComponent,
    ModalFormDemoComponent,
    ModalFullPageDemoComponent,
    ModalTiledDemoComponent,
    ModalVisualComponent,
    ModalLookupComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyAutocompleteModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyTilesModule,
    SkyModalModule,
    ModalVisualRoutingModule,
    SkyHelpInlineModule,
    LipsumModule,
    DataManagerModule,
    SkyLookupModule,
    SkyToggleSwitchModule,
  ],
})
export class ModalVisualModule {
  public static routes = ModalVisualRoutingModule.routes;
}
