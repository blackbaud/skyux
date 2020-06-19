import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild
} from '@angular/core';

import {
  SkyModalService
} from '@skyux/modals';

import {
  Subject
} from 'rxjs';

import {
  SkyProgressIndicatorActionClickArgs,
  SkyProgressIndicatorChange,
  SkyProgressIndicatorMessage,
  SkyProgressIndicatorMessageType
} from '../../public/public_api';

import {
  SkyProgressIndicatorComponent
} from '../../public/modules/progress-indicator/progress-indicator.component';

import {
  ProgressIndicatorWizardDemoComponent
} from './progress-indicator-horizontal-visual.component';

@Component({
  selector: 'progress-indicator-visual',
  templateUrl: './progress-indicator-visual.component.html'
})
export class ProgressIndicatorVisualComponent implements OnDestroy {

  @ViewChild('horizontalIndicator')
  public set progressIndicator(value: SkyProgressIndicatorComponent) {
    this._progressIndicator = value;
    // NOTE: Detect changes is used here instead of `markForCheck` as that still throws errors. The
    // statement is needed as the template will throw errors when the ViewChild updates without it
    this.changeDetector.detectChanges();
  }

  public get progressIndicator(): SkyProgressIndicatorComponent {
    return this._progressIndicator;
  }

  public disabled: boolean;
  public messageStream = new Subject<SkyProgressIndicatorMessage>();
  public messageStreamHorizontal = new Subject<any>();
  public showElement: boolean = true;
  public startingIndex: number;

  private _progressIndicator: SkyProgressIndicatorComponent;

  constructor(
    private modalService: SkyModalService,
    private changeDetector: ChangeDetectorRef
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

  public onFinishClick(args: SkyProgressIndicatorActionClickArgs): void {
    this.disabled = true;
    // Simulate an asynchronous call.
    setTimeout(() => {
      args.progressHandler.advance();
      this.disabled = false;
    }, 2000);
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

  public toggleProgressIndicator(): void {
    this.showElement = !this.showElement;
  }
}
