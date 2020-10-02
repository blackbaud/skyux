import {
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange
} from '@skyux/docs-tools';

@Component({
  selector: 'app-card-docs',
  templateUrl: './card-docs.component.html'
})
export class CardDocsComponent {

  public demoSettings: any = {};

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.showTitle !== undefined) {
      this.demoSettings.showTitle = change.showTitle;
    }
    if (change.showContent !== undefined) {
      this.demoSettings.showContent = change.showContent;
    }
    if (change.showAction !== undefined) {
      this.demoSettings.showAction = change.showAction;
    }
    if (change.showCheckbox !== undefined) {
      this.demoSettings.showCheckbox = change.showCheckbox;
    }
  }

}
