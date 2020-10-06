import {
  NgModule
} from '@angular/core';

import {
  SkyIdModule
} from '@skyux/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyCheckboxModule,
  SkyInputBoxModule
} from '@skyux/forms';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyBackToTopModule,
  SkyFluidGridModule,
  SkyInlineDeleteModule,
  SkyToolbarModule
} from '@skyux/layout';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  ModalFilterDemoModalComponent
} from './docs/filter/demo/modal-filter-demo-modal.component';

import {
  SkyFilterModule,
  SkyInfiniteScrollModule,
  SkyPagingModule,
  SkyRepeaterModule,
  SkySortModule
} from './public/public_api';

@NgModule({
  entryComponents: [
    ModalFilterDemoModalComponent
  ],
  exports: [
    SkyAppLinkModule,
    SkyBackToTopModule,
    SkyCheckboxModule,
    SkyDocsToolsModule,
    SkyDropdownModule,
    SkyFilterModule,
    SkyFluidGridModule,
    SkyIconModule,
    SkyIdModule,
    SkyInfiniteScrollModule,
    SkyInlineDeleteModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyPagingModule,
    SkyRepeaterModule,
    SkySortModule,
    SkyToolbarModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-lists',
        packageName: '@skyux/lists'
      }
    }
  ]
})
export class AppExtrasModule { }
