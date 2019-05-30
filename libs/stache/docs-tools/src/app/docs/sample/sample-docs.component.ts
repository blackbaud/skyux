import {
  Component, ChangeDetectorRef
} from '@angular/core';

import { SkyDocsBehaviorDemoControlPanelConfig } from '../../public';

@Component({
  selector: 'app-sample-docs',
  templateUrl: './sample-docs.component.html'
})
export class AppSampleDocsComponent {
  public behaviorDemoConfig: SkyDocsBehaviorDemoControlPanelConfig = {
    columns: [
      {
        radioGroup: {
          name: 'placement',
          heading: 'Placement',
          value: 'above',
          radios: [
            { value: 'above', label: 'Above' },
            { value: 'below', label: 'Below' },
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' }
          ]
        }
      },
      {
        radioGroup: {
          name: 'alignment',
          heading: 'Alignment',
          value: 'center',
          radios: [
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' },
            { value: 'center', label: 'Center' }
          ]
        }
      },
      {
        checkboxes: [
          { label: 'Include title', checked: false, value: 'includeTitle' }
        ]
      }
    ]
  };

  public behaviorDemoProperties: any = {};

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  public onBehaviorDemoSelection(change: any): void {
    this.behaviorDemoProperties = {
      skyPopoverAlignment: change.columns[1].radioGroup.value,
      skyPopoverPlacement: change.columns[0].radioGroup.value,
      popoverTitle: (change.columns[2].checkboxes[0].checked === true) ? 'Popover title' : ''
    };
    this.changeDetector.markForCheck();
  }
}
