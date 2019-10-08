import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyCoreAdapterService
} from '@skyux/core';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyToolbarModule
} from '@skyux/layout';

import {
  TreeModule
} from 'angular-tree-component';

import {
  SkyAngularTreeResourcesModule
} from '../shared/angular-tree-resources.module';

import {
  SkyAngularTreeAdapterService
} from './angular-tree-adapter.service';

import {
  SkyAngularTreeContextMenuComponent
} from './angular-tree-context-menu.component';

import {
  SkyAngularTreeNodeComponent
} from './angular-tree-node.component';

import {
  SkyTreeViewToolbarComponent
} from './angular-tree-toolbar.component';

import {
  SkyAngularTreeWrapperComponent
} from './angular-tree-wrapper.component';

@NgModule({
  declarations: [
    SkyAngularTreeContextMenuComponent,
    SkyAngularTreeNodeComponent,
    SkyAngularTreeWrapperComponent,
    SkyTreeViewToolbarComponent
  ],
  imports: [
    CommonModule,
    SkyAngularTreeResourcesModule,
    SkyCheckboxModule,
    SkyIconModule,
    SkyToolbarModule,
    TreeModule
  ],
  providers: [
    SkyAngularTreeAdapterService,
    SkyCoreAdapterService
  ],
  exports: [
    SkyAngularTreeContextMenuComponent,
    SkyAngularTreeNodeComponent,
    SkyAngularTreeWrapperComponent,
    SkyTreeViewToolbarComponent
  ]
})
export class SkyAngularTreeModule { }
