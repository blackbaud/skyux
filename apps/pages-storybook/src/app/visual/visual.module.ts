import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyActionHubModule, SkyPageHeaderModule } from '@skyux/pages';

import { ActionHubVisualComponent } from './action-hub/action-hub-visual.component';
import { PageHeaderVisualComponent } from './page-header/page-header-visual.component';
import { VisualComponent } from './visual.component';

@NgModule({
  declarations: [
    ActionHubVisualComponent,
    PageHeaderVisualComponent,
    VisualComponent,
  ],
  imports: [CommonModule, SkyActionHubModule, SkyPageHeaderModule],
  exports: [
    ActionHubVisualComponent,
    PageHeaderVisualComponent,
    VisualComponent,
  ],
})
export class VisualModule {}
