import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyCoreAdapterService,
  SkyMediaQueryService
} from '@skyux/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkySplitViewResourcesModule
} from '../shared/split-view-resources.module';

import {
  SkySplitViewComponent
} from './split-view.component';

import {
  SkySplitViewDrawerComponent
} from './split-view-drawer.component';

import {
  SkySplitViewMediaQueryService
} from './split-view-media-query.service';

import {
  SkySplitViewWorkspaceHeaderComponent
} from './split-view-workspace-header.component';

import {
  SkySplitViewWorkspaceComponent
} from './split-view-workspace.component';

import {
  SkySplitViewWorkspaceContentComponent
} from './split-view-workspace-content.component';

import {
  SkySplitViewWorkspaceFooterComponent
} from './split-view-workspace-footer.component';

@NgModule({
  declarations: [
    SkySplitViewComponent,
    SkySplitViewDrawerComponent,
    SkySplitViewWorkspaceComponent,
    SkySplitViewWorkspaceContentComponent,
    SkySplitViewWorkspaceFooterComponent,
    SkySplitViewWorkspaceHeaderComponent
  ],
  providers: [
    SkyCoreAdapterService,
    SkyMediaQueryService,
    SkySplitViewMediaQueryService
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    SkyIconModule,
    SkySplitViewResourcesModule
  ],
  exports: [
    SkySplitViewComponent,
    SkySplitViewDrawerComponent,
    SkySplitViewWorkspaceComponent,
    SkySplitViewWorkspaceContentComponent,
    SkySplitViewWorkspaceFooterComponent,
    SkySplitViewWorkspaceHeaderComponent
  ]
})
export class SkySplitViewModule { }
