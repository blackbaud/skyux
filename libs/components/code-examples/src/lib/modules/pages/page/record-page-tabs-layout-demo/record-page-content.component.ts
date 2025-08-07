import { Component } from '@angular/core';
import { SkyTabIndex, SkyTabsModule } from '@skyux/tabs';

import { RecordPageAttachmentsTabComponent } from './record-page-attachments-tab.component';
import { RecordPageNotesTabComponent } from './record-page-notes-tab.component';
import { RecordPageOverviewTabComponent } from './record-page-overview-tab.component';

@Component({
  selector: 'app-record-page-content',
  templateUrl: './record-page-content.component.html',
  imports: [
    RecordPageAttachmentsTabComponent,
    RecordPageNotesTabComponent,
    RecordPageOverviewTabComponent,
    SkyTabsModule,
  ],
})
export class RecordPageContentComponent {
  protected activeTabIndex: SkyTabIndex = 0;
}
