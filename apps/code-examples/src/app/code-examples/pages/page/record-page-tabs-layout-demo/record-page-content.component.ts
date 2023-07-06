import { Component } from '@angular/core';
import { SkyTabIndex } from '@skyux/tabs';

@Component({
  selector: 'app-record-page-content',
  templateUrl: './record-page-content.component.html',
})
export class RecordPageContentComponent {
  public activeTabIndex: SkyTabIndex = 0;
}
