import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyTilesModule
} from '@skyux/tiles';

import {
  SkyConfirmModule,
  SkyModalModule
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

import {
  ModalCloseConfirmComponent
} from './visual/modal/modal-close-confirm.component';

require('style-loader!./visual.scss');

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyConfirmModule,
    SkyModalModule,
    SkyTilesModule
  ],
  entryComponents: [
    ModalDemoComponent,
    ModalContentDemoComponent,
    ModalFullPageDemoComponent,
    ModalLargeDemoComponent,
    ModalTiledDemoComponent,
    ModalContentAutofocusComponent,
    ModalCloseConfirmComponent
  ]
})
export class AppExtrasModule { }
