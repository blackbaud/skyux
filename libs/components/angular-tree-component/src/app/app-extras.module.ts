import {
  NgModule
} from '@angular/core';

import {
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  TreeModule
} from 'angular-tree-component';

import {
  SkyAngularTreeModule
} from './public/public_api';

// Build will crash if we try to insert function calls inside the NgModule decorator.
// To get around this, we just use a variable to refer to the .forRoot() function call.
// https://github.com/angular/angular/issues/23609
const treeModuleForRoot = TreeModule.forRoot();

@NgModule({
  imports: [
    treeModuleForRoot
  ],
  exports: [
    SkyAngularTreeModule,
    SkyCodeModule,
    SkyAppLinkModule,
    SkyDocsToolsModule,
    SkyDropdownModule,
    TreeModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-angular-tree-component',
        packageName: '@skyux/angular-tree-component'
      }
    }
  ]
})
export class AppExtrasModule { }
