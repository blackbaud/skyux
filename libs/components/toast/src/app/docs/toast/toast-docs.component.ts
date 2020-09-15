import {
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange,
  SkyDocsDemoControlPanelRadioChoice
} from '@skyux/docs-tools';

import {
  SkyToastService,
  SkyToastType
} from '../../public/public_api';

@Component({
  selector: 'app-toast-docs',
  templateUrl: './toast-docs.component.html'
})
export class ToastDocsComponent {

  public demoSettings: {
    toastType?: SkyToastType;
  } = { };

  public toastTypeChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: SkyToastType.Danger, label: 'Danger' },
    { value: SkyToastType.Info, label: 'Info' },
    { value: SkyToastType.Success, label: 'Success' },
    { value: SkyToastType.Warning, label: 'Warning' }
  ];

  constructor(
    private toastService: SkyToastService
  ) { }

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    this.demoSettings.toastType = change.toastType;
  }

  public openToast(): void {
    this.toastService.openMessage('This is a sample toast message.', {
      type: this.demoSettings.toastType
    });
  }

  public closeAll(): void {
    this.toastService.closeAll();
  }

}
