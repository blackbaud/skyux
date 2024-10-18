import { NgModule } from '@angular/core';

import { SkySplitViewDrawerComponent } from './split-view-drawer.component';
import { SkySplitViewWorkspaceContentComponent } from './split-view-workspace-content.component';
import { SkySplitViewWorkspaceFooterComponent } from './split-view-workspace-footer.component';
import { SkySplitViewWorkspaceHeaderComponent } from './split-view-workspace-header.component';
import { SkySplitViewWorkspaceComponent } from './split-view-workspace.component';
import { SkySplitViewComponent } from './split-view.component';

@NgModule({
  imports: [
    SkySplitViewComponent,
    SkySplitViewDrawerComponent,
    SkySplitViewWorkspaceComponent,
    SkySplitViewWorkspaceContentComponent,
    SkySplitViewWorkspaceFooterComponent,
    SkySplitViewWorkspaceHeaderComponent,
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
