import { NgModule } from '@angular/core';
import { SkyCoreAdapterService } from '@skyux/core';

import { SkyAngularTreeComponentResourcesModule } from '../shared/sky-angular-tree-component-resources.module';

import { SkyAngularTreeContextMenuComponent } from './angular-tree-context-menu.component';
import { SkyAngularTreeNodeComponent } from './angular-tree-node.component';
import { SkyAngularTreeToolbarComponent } from './angular-tree-toolbar.component';
import { SkyAngularTreeWrapperComponent } from './angular-tree-wrapper.component';

@NgModule({
  imports: [
    SkyAngularTreeComponentResourcesModule,
    SkyAngularTreeContextMenuComponent,
    SkyAngularTreeNodeComponent,
    SkyAngularTreeToolbarComponent,
    SkyAngularTreeWrapperComponent,
  ],
  providers: [SkyCoreAdapterService],
  exports: [SkyAngularTreeNodeComponent, SkyAngularTreeWrapperComponent],
})
export class SkyAngularTreeModule {}
