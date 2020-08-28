import {
  NgModule
} from '@angular/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyInputBoxModule
} from '@skyux/forms';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyBackToTopModule,
  SkyFluidGridModule,
  SkyInlineDeleteModule
} from '@skyux/layout';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyFilterModule,
  SkyInfiniteScrollModule,
  SkyPagingModule,
  SkyRepeaterModule,
  SkySortModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyBackToTopModule,
    SkyDocsToolsModule,
    SkyDropdownModule,
    SkyFilterModule,
    SkyFluidGridModule,
    SkyIconModule,
    SkyInfiniteScrollModule,
    SkyInlineDeleteModule,
    SkyInputBoxModule,
    SkyPagingModule,
    SkyRepeaterModule,
    SkySortModule
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
