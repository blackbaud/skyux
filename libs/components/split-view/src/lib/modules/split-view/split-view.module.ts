import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import { SkySplitViewResourcesModule } from '../shared/sky-split-view-resources.module';

import { SkySplitViewDrawerComponent } from './split-view-drawer.component';
import { SkySplitViewWorkspaceContentComponent } from './split-view-workspace-content.component';
import { SkySplitViewWorkspaceFooterComponent } from './split-view-workspace-footer.component';
import { SkySplitViewWorkspaceHeaderComponent } from './split-view-workspace-header.component';
import { SkySplitViewWorkspaceComponent } from './split-view-workspace.component';
import { SkySplitViewComponent } from './split-view.component';

@NgModule({
  declarations: [
    SkySplitViewComponent,
    SkySplitViewDrawerComponent,
    SkySplitViewWorkspaceComponent,
    SkySplitViewWorkspaceContentComponent,
    SkySplitViewWorkspaceFooterComponent,
    SkySplitViewWorkspaceHeaderComponent,
  ],
  imports: [
    CommonModule,
    SkyIconModule,
    SkySplitViewResourcesModule,
    SkyThemeModule,
  ],
  exports: [
    SkySplitViewComponent,
    SkySplitViewDrawerComponent,
    SkySplitViewWorkspaceComponent,
    SkySplitViewWorkspaceContentComponent,
    SkySplitViewWorkspaceFooterComponent,
    SkySplitViewWorkspaceHeaderComponent,
  ],
})
export class SkySplitViewModule {}
