import {
  NgModule
} from '@angular/core';

import {
  SkyTilesModule
} from '@skyux/tiles';

import {
  SkyConfirmModule,
  SkyModalModule,
  SkyModalService
} from './public';

import {
  ModalDemoComponent
} from './visual/modal/modal-demo.component';

import {
  ModalContentDemoComponent
} from './visual/modal/modal-content-demo.component';

import {
  ModalFullPageDemoComponent
} from './visual/modal/modal-fullpage-demo.component';

import {
  ModalLargeDemoComponent
} from './visual/modal/modal-large-demo.component';

import {
  ModalTiledDemoComponent
} from './visual/modal/modal-tiled-demo.component';

import {
  ModalContentAutofocusComponent
} from './visual/modal/modal-content-autofocus.component';

require('style-loader!./visual.scss');

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
    ModalTiledDemoComponent,
    ModalContentAutofocusComponent
  ]
})
export class AppExtrasModule { }
