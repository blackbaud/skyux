import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  ReactiveFormsModule
} from '@angular/forms';

import {
  SkyAngularTreeModule
} from '@skyux/angular-tree-component';

import {
  SkyCheckboxModule,
  SkyRadioModule
} from '@skyux/forms';

import {
  SkyFluidGridModule
} from '@skyux/layout';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  TreeModule
} from 'angular-tree-component';

import {
  AngularTreeDemoComponent
} from './angular-tree-demo.component';

// Store the result of the `forRoot` call in a variable to support AoT compilation.
// See: https://github.com/angular/angular/issues/23609
const treeModuleForRoot = TreeModule.forRoot();

@NgModule({
  imports: [
    treeModuleForRoot,
    CommonModule,
    ReactiveFormsModule,
    SkyAngularTreeModule,
    SkyCheckboxModule,
    SkyDropdownModule,
    SkyFluidGridModule,
    SkyRadioModule
  ],
  declarations: [
    AngularTreeDemoComponent
  ],
  exports: [
    AngularTreeDemoComponent
  ]
})
export class AngularTreeDemoModule { }
