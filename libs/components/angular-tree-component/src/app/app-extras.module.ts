import {
  NgModule
} from '@angular/core';

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
} from './public';

// Build will crash if we try to insert function calls inside the NgModule decorator.
// To get around this, we just use a variable to refer to the .forRoot() function call.
// https://github.com/angular/angular/issues/23609
const treeModuleForRoot = TreeModule.forRoot();

@NgModule({
  imports: [
    treeModuleForRoot
  ],
  exports: [
    SkyAppLinkModule,
    SkyDropdownModule,
    SkyAngularTreeModule,
    TreeModule
  ]
})
export class AppExtrasModule { }
