import {
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange
} from '@skyux/docs-tools';

@Component({
  selector: 'app-text-highlight-docs',
  templateUrl: './text-highlight-docs.component.html'
})
export class TextHighlightDocsComponent {

  public demoSettings: any = {};

  public searchTerm: string;

  public showAdditionalContent: boolean = false;

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.showAdditionalContent !== undefined) {
      this.demoSettings.showAdditionalContent = change.showAdditionalContent;
    }
  }

}
