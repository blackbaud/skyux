import {
  NgModule
} from '@angular/core';

import {
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyMediaQueryModule
} from '@skyux/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyThemeModule
} from './public/public_api';

import {
  SkyDefinitionListModule,
  SkyFluidGridModule
} from '@skyux/layout';

import {
  SkyGridModule
} from '@skyux/grids';

import {
  SkySortModule
} from '@skyux/lists';

import {
  SkyCheckboxModule
} from '@skyux/forms';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCheckboxModule,
    SkyCodeModule,
    SkyDefinitionListModule,
    SkyDocsToolsModule,
    SkyDropdownModule,
    SkyFluidGridModule,
    SkyGridModule,
    SkyIconModule,
    SkySortModule,
    SkyThemeModule,
    SkyMediaQueryModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-theme',
        packageName: '@skyux/theme'
      }
    }
  ]
})
export class AppExtrasModule { }
