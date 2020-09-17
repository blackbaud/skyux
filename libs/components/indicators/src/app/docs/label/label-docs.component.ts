import {
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange,
  SkyDocsDemoControlPanelRadioChoice
} from '@skyux/docs-tools';

import {
  SkyLabelType
} from '../../public/public_api';

@Component({
  selector: 'app-label-docs',
  templateUrl: './label-docs.component.html'
})
export class LabelDocsComponent {

  public demoSettings: {
    labelType?: SkyLabelType;
  } = { };

  public labelTypeChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: 'danger', label: 'Danger' },
    { value: 'info', label: 'Info' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' }
  ];

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    this.demoSettings.labelType = change.labelType;
  }

}
