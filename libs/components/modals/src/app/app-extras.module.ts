import {
  NgModule
} from '@angular/core';

import {
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyIdModule
} from '@skyux/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyInputBoxModule
} from '@skyux/forms';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyTilesModule
} from '@skyux/tiles';

import {
  SkyConfirmModule,
  SkyModalModule
} from './public/public_api';

import {
  ModalDocsModalComponent
} from './docs/modal/modal-docs-modal.component';

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

import {
  ModalFormDemoComponent
} from './visual/modal/modal-form-demo.component';

require('style-loader!./visual.scss');

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCodeModule,
    SkyConfirmModule,
    SkyDocsToolsModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyTilesModule
  ],
  entryComponents: [
    ModalDemoComponent,
    ModalDocsModalComponent,
    ModalContentDemoComponent,
    ModalFormDemoComponent,
    ModalFullPageDemoComponent,
    ModalLargeDemoComponent,
    ModalTiledDemoComponent,
    ModalContentAutofocusComponent,
    ModalCloseConfirmComponent
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-modals',
        packageName: '@skyux/modals'
      }
    }
  ]
})
export class AppExtrasModule { }
