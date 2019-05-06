import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ViewChildren,
  QueryList
} from '@angular/core';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkyProgressIndicatorNavButtonComponent
} from '../progress-indicator-nav-button/progress-indicator-nav-button.component';

import {
  SkyProgressIndicatorResetButtonComponent
} from '../progress-indicator-reset-button/progress-indicator-reset-button.component';

import {
  SkyProgressIndicatorDisplayMode,
  SkyProgressIndicatorMessage,
  SkyProgressIndicatorMessageType,
  SkyProgressIndicatorChange
} from '../types';

import {
  SkyProgressIndicatorComponent
} from '../progress-indicator.component';

@Component({
  selector: 'test-progress-indicator',
  templateUrl: './progress-indicator.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyProgressIndicatorFixtureComponent {
  public displayMode: SkyProgressIndicatorDisplayMode;
  public isPassive: boolean;
  public messageStream = new Subject<SkyProgressIndicatorMessage | SkyProgressIndicatorMessageType>();
  public startingIndex: number;

  public previousButtonText: string;
  public previousButtonType = 'previous';
  public previousButtonDisabled: boolean;

  public nextButtonText: string;
  public nextButtonType = 'next';
  public nextButtonDisabled: boolean;

  public resetButtonDisabled: boolean;

  public activeIndex = 0;
  public resetWasClicked = false;
  public progressChangesEmitted = false;

  @ViewChild(SkyProgressIndicatorComponent)
  public progressIndicator: SkyProgressIndicatorComponent;

  @ViewChildren(SkyProgressIndicatorNavButtonComponent)
  public navButtons: QueryList<SkyProgressIndicatorNavButtonComponent>;

  @ViewChild(SkyProgressIndicatorResetButtonComponent)
  public resetButton: SkyProgressIndicatorResetButtonComponent;

  public get isHorizontal() {
    return this.displayMode === SkyProgressIndicatorDisplayMode.Horizontal;
  }

  constructor(private changeDetector: ChangeDetectorRef) { }

  public progress(): void {
    this.progressIndicator.messageStream.next(SkyProgressIndicatorMessageType.Progress);
  }

  public regress(): void {
    this.progressIndicator.messageStream.next(SkyProgressIndicatorMessageType.Regress);
  }

  public resetClicked(): void {
    this.resetWasClicked = true;
  }

  public sendMessage(message: SkyProgressIndicatorMessage): void {
    this.messageStream.next(message);
  }

  public updateIndex(changes: SkyProgressIndicatorChange): void {
    this.progressChangesEmitted = true;
    this.activeIndex = changes.activeIndex;
    this.changeDetector.detectChanges();
  }
}
