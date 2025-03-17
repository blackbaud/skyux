import { NgModule } from '@angular/core';

import { SkyActionHubButtonsComponent } from './action-hub-buttons.component';
import { SkyActionHubContentComponent } from './action-hub-content.component';
import { SkyActionHubRelatedLinksSortPipe } from './action-hub-related-links-sort.pipe';
import { SkyActionHubComponent } from './action-hub.component';

@NgModule({
  imports: [
    SkyActionHubButtonsComponent,
    SkyActionHubComponent,
    SkyActionHubContentComponent,
    SkyActionHubRelatedLinksSortPipe,
  ],
  exports: [
    SkyActionHubButtonsComponent,
    SkyActionHubComponent,
    SkyActionHubContentComponent,
  ],
})
export class SkyActionHubModule {}
