import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TreeModule } from '@blackbaud/angular-tree-component';
import { SkyCoreAdapterService } from '@skyux/core';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyIconModule } from '@skyux/icon';
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
    SkyHelpInlineModule,
    SkyIconModule,
    SkyToolbarModule,
    TreeModule,
  ],
  providers: [SkyCoreAdapterService],
  exports: [SkyAngularTreeNodeComponent, SkyAngularTreeWrapperComponent],
})
export class SkyAngularTreeModule {}
