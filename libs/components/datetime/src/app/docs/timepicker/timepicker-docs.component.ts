import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange,
  SkyDocsDemoControlPanelRadioChoice
} from '@skyux/docs-tools';

@Component({
  selector: 'app-timepicker-docs',
  templateUrl: './timepicker-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimepickerDocsComponent {

  public demoModel: {
    selectedTime?: string;
  } = { };

  public demoSettings: {
    disabled?: boolean;
    timeFormat?: string;
  } = { };

  public timeFormatChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: 'hh', label: '12-hour' },
    { value: 'HH', label: '24-hour' }
  ];

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    this.demoSettings.timeFormat = change.timeFormat;
  }

}
