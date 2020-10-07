import {
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange,
  SkyDocsDemoControlPanelRadioChoice
} from '@skyux/docs-tools';

import {
  SkyWaitService
} from '../../public/public_api';

@Component({
  selector: 'app-wait-docs',
  templateUrl: './wait-docs.component.html'
})
export class WaitDocsComponent {

  public demoSettings: any = {};

  public waitTypeChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: 'element', label: 'Element wait' },
    { value: 'page', label: 'Page wait' },
    { value: 'nonBlockingPage', label: 'Non-blocking page wait' }
  ];

  public isWaiting = false;

  constructor(
    private waitSvc: SkyWaitService
  ) { }

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    this.demoSettings.waitType = change.waitType;
  }

  public onToggleWaitClick(): void {
    switch (this.demoSettings.waitType) {
      case 'page':
        this.waitSvc.beginBlockingPageWait();
        setTimeout(() => {
          this.waitSvc.endBlockingPageWait();
        }, 2000);
        break;
      case 'nonBlockingPage':
        this.waitSvc.beginNonBlockingPageWait();
        setTimeout(() => {
          this.waitSvc.endNonBlockingPageWait();
        }, 2000);
        break;
      default:
        this.isWaiting = true;
        setTimeout(() => {
          this.isWaiting = false;
        }, 2000);
        break;
    }
  }

}
