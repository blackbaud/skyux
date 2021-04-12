import {
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange,
  SkyDocsDemoControlPanelRadioChoice
} from '@skyux/docs-tools';

@Component({
  selector: 'app-selection-box-docs',
  templateUrl: './selection-box-docs.component.html'
})
export class SelectionBoxDocsComponent {

  public demoSettings: any = {};

  public formChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: 'checkbox', label: 'Multi-select' },
    { value: 'radio', label: 'Single-select' }
  ];

  public items: any[] = [
    {
      name: 'Save time and effort',
      icon: 'clock',
      description: 'Automate mundane tasks and spend more time on the things that matter.',
      value: 'time'
    },
    {
      name: 'Boost engagement',
      icon: 'chevron-up',
      description: 'Encourage supporters to interact with your organization.',
      value: 'engagement'
    },
    {
      name: 'Build relationships',
      icon: 'users',
      description: 'Connect to supporters on a personal level and maintain accurate data.',
      value: 'relationships'
    }
  ];

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.mode !== undefined) {
      this.demoSettings.mode = change.mode;
    }
    if (change.showIcon !== undefined) {
      this.demoSettings.showIcon = change.showIcon;
    }
    if (change.showDescription !== undefined) {
      this.demoSettings.showDescription = change.showDescription;
    }
  }

}
