import {
  Component
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyProgressIndicatorMessageType,
  SkyModalService
} from '@blackbaud/skyux/dist/core';

import {
  ProgressIndicatorWizardDemoComponent
} from './progress-indicator-horizontal-visual.component';

@Component({
  selector: 'progress-indicator-visual',
  templateUrl: './progress-indicator-visual.component.html'
})
export class ProgressIndicatorVisualComponent {
  public step1 = false;
  public step2 = false;
  public step3 = false;

  public messageStream = new Subject<SkyProgressIndicatorMessageType>();

  constructor(private modal: SkyModalService) { }

  public progress(): void {
    this.messageStream.next(SkyProgressIndicatorMessageType.Progress);
  }

  public regress(): void {
    this.messageStream.next(SkyProgressIndicatorMessageType.Regress);
  }

  public openWizard(): void {
    this.modal.open(ProgressIndicatorWizardDemoComponent);
  }
}
