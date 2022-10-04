import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TreeModule } from '@circlon/angular-tree-component';
import { SkyCoreAdapterService, SkyTrimModule } from '@skyux/core';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/indicators';
import { SkyToolbarModule } from '@skyux/layout';

import { SkyAngularTreeComponentResourcesModule } from '../shared/sky-angular-tree-component-resources.module';

import { SkyAngularTreeContextMenuComponent } from './angular-tree-context-menu.component';
import { SkyAngularTreeNodeComponent } from './angular-tree-node.component';
import { SkyTreeViewToolbarComponent } from './angular-tree-toolbar.component';
import { SkyAngularTreeWrapperComponent } from './angular-tree-wrapper.component';

@NgModule({
  declarations: [
    SkyAngularTreeContextMenuComponent,
    SkyAngularTreeNodeComponent,
    SkyAngularTreeWrapperComponent,
    SkyTreeViewToolbarComponent,
  ],
  imports: [
    CommonModule,
    SkyAngularTreeComponentResourcesModule,
    SkyCheckboxModule,
    SkyIconModule,
    SkyToolbarModule,
    TreeModule,
    SkyTrimModule,
  ],
  providers: [SkyCoreAdapterService],
  exports: [SkyAngularTreeNodeComponent, SkyAngularTreeWrapperComponent],
})
export class SkyAngularTreeModule {}
