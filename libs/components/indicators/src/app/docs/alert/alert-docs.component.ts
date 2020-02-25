import {
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange,
  SkyDocsDemoControlPanelRadioChoice
} from '@skyux/docs-tools';

@Component({
  selector: 'app-alert-docs',
  templateUrl: './alert-docs.component.html'
})
export class AlertDocsComponent {
  public typeChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: 'danger', label: 'Danger' },
    { value: 'info', label: 'Info' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' }
  ];

  public alertMessage = 'Danger alert message';

  public alerts: any[] = [];

  public demoSettings: any = {};

  private defaultAlerts = [{}];

  constructor() {
    this.alerts = this.defaultAlerts;
  }

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    this.demoSettings.closed = false;

    if (change.closeable !== undefined) {
      this.demoSettings.closeable = change.closeable;
    }
    if (change.alertType) {
      this.demoSettings.type = change.alertType;
      if (this.demoSettings.type === 'danger') {
        this.alertMessage = 'Danger alert message.';
      } else if (this.demoSettings.type === 'info') {
        this.alertMessage = 'Info alert message.';
      } else if (this.demoSettings.type === 'success') {
        this.alertMessage = 'Success alert message.';
      } else if (this.demoSettings.type === 'warning') {
        this.alertMessage = 'Warning alert message.';
      }
    }
  }

  public onDemoReset(): void {
    this.alerts = this.defaultAlerts;
  }
}
