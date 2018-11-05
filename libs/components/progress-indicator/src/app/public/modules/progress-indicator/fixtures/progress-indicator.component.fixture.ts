import {
  Component,
  ViewChild,
  QueryList,
  ViewChildren,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  SkyProgressIndicatorComponent,
  SkyProgressIndicatorMessageType,
  SkyProgressIndicatorChange
} from '..';
import {
  SkyProgressIndicatorNavButtonComponent
} from '../progress-indicator-nav-button';
import {
  SkyProgressIndicatorResetButtonComponent
} from '../progress-indicator-reset-button';
import {
  SkyProgressIndicatorDisplayMode
} from '../types/progress-indicator-mode';

@Component({
  selector: 'test-progress-indicator',
  templateUrl: './progress-indicator.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressIndicatorTestComponent {
  public displayMode: SkyProgressIndicatorDisplayMode;
  public isPassive: boolean;
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

  public updateIndex(changes: SkyProgressIndicatorChange): void {
    this.activeIndex = changes.activeIndex;
    this.changeDetector.detectChanges();
  }
}
