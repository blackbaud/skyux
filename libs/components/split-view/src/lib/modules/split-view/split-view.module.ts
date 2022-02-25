import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyIconModule } from '@skyux/indicators';

import { SkyThemeModule } from '@skyux/theme';

import { SplitViewResourcesModule } from '../shared/split-view-resources.module';

import { SkySplitViewComponent } from './split-view.component';

import { SkySplitViewDrawerComponent } from './split-view-drawer.component';

import { SkySplitViewWorkspaceHeaderComponent } from './split-view-workspace-header.component';

import { SkySplitViewWorkspaceComponent } from './split-view-workspace.component';

import { SkySplitViewWorkspaceContentComponent } from './split-view-workspace-content.component';

import { SkySplitViewWorkspaceFooterComponent } from './split-view-workspace-footer.component';

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
    SplitViewResourcesModule,
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
