import {
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange
} from '@skyux/docs-tools';

@Component({
  selector: 'app-definition-list-docs',
  templateUrl: './definition-list-docs.component.html',
  styleUrls: ['./definition-list-docs.component.scss']
})
export class DefinitionListDocsComponent {

  public demoSettings: any = {};

  public items: { label: string, value: string }[] = [
    {
      label: 'Field 1',
      value: 'Field 1 value'
    },
    {
      label: 'Field 2',
      value: 'Field 2 value'
    },
    {
      label: 'Field 3',
      value: undefined
    },
    {
      label: 'Field 4',
      value: 'Field 4 value'
    }
  ];

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.showHeading !== undefined) {
      this.demoSettings.showHeading = change.showHeading;
    }
  }

}
