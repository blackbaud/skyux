import {
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange
} from '@skyux/docs-tools';

@Component({
  selector: 'app-page-summary-docs',
  templateUrl: './page-summary-docs.component.html'
})
export class PageSummaryDocsComponent {

  public demoSettings: any = {};

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.alert !== undefined) {
      this.demoSettings.alert = change.alert;
    }
    if (change.title !== undefined) {
      this.demoSettings.title = change.title;
    }
    if (change.subtitle !== undefined) {
      this.demoSettings.subtitle = change.subtitle;
    }
    if (change.image !== undefined) {
      this.demoSettings.image = change.image;
    }
    if (change.status !== undefined) {
      this.demoSettings.status = change.status;
    }
    if (change.keyInfo !== undefined) {
      this.demoSettings.keyInfo = change.keyInfo;
    }
    if (change.content !== undefined) {
      this.demoSettings.content = change.content;
    }
  }
}
