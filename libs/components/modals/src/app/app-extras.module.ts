import {
  NgModule
} from '@angular/core';

import {
  SkyConfirmModule,
  SkyModalModule,
  SkyModalService
} from './public';

import {
  SkyTilesModule
} from '@skyux/tiles';

import { ModalDemoComponent } from './visual/modal/modal-demo.component';
import { ModalContentDemoComponent } from './visual/modal/modal-content-demo.component';
import { ModalFullPageDemoComponent } from './visual/modal/modal-fullpage-demo.component';
import { ModalLargeDemoComponent } from './visual/modal/modal-large-demo.component';
import { ModalTiledDemoComponent } from './visual/modal/modal-tiled-demo.component';

@NgModule({
  imports: [
    SkyConfirmModule,
    SkyModalModule,
    SkyTilesModule
  ],
  exports: [
    SkyConfirmModule,
    SkyModalModule,
    SkyTilesModule
  ],
  providers: [
    SkyModalService
  ],
  entryComponents: [
    ModalDemoComponent,
    ModalContentDemoComponent,
    ModalFullPageDemoComponent,
    ModalLargeDemoComponent,
    ModalTiledDemoComponent
  ]
})
export class AppExtrasModule { }
