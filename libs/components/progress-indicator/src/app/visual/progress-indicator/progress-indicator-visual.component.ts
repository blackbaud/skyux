import {
  Component,
  OnDestroy
} from '@angular/core';

import {
  SkyModalService
} from '@skyux/modals';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkyProgressIndicatorChange,
  SkyProgressIndicatorMessage,
  SkyProgressIndicatorMessageType
} from '../../public';

import {
  ProgressIndicatorWizardDemoComponent
} from './progress-indicator-horizontal-visual.component';

@Component({
  selector: 'progress-indicator-visual',
  templateUrl: './progress-indicator-visual.component.html'
})
export class ProgressIndicatorVisualComponent implements OnDestroy {

  public disabled: boolean;
  public messageStream = new Subject<SkyProgressIndicatorMessage>();
  public messageStreamHorizontal = new Subject<any>();
  public startingIndex: number;

  constructor(
    private modalService: SkyModalService
  ) { }

  public ngOnDestroy(): void {
    this.messageStream.complete();
    this.messageStreamHorizontal.complete();
  }

  public onPreviousClick(): void {
    this.sendMessage({
      type: SkyProgressIndicatorMessageType.Regress
    });
  }

  public onNextClick(): void {
    this.sendMessage({
      type: SkyProgressIndicatorMessageType.Progress
    });
  }

  public onGoToClick(): void {
    this.sendMessage({
      type: SkyProgressIndicatorMessageType.GoTo,
      data: {
        activeIndex: 0
      }
    });
  }

  public onProgressChanges(change: SkyProgressIndicatorChange): void {
    console.log('Progress change:', change);
  }

  public disableNavButtons(): void {
    this.disabled = !this.disabled;
  }

  public sendMessage(message: any): void {
    this.messageStream.next(message);
  }

  public openModal(): void {
    this.modalService.open(ProgressIndicatorWizardDemoComponent);
  }
}
