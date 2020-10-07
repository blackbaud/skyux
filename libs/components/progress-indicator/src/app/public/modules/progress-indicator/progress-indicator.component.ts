import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
  QueryList,
  ChangeDetectorRef
} from '@angular/core';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  Subject
} from 'rxjs';

import {
  delay,
  takeUntil
} from 'rxjs/operators';

import {
  SkyProgressIndicatorItemComponent
} from './progress-indicator-item/progress-indicator-item.component';

import {
  SkyProgressIndicatorChange
} from './types/progress-indicator-change';

import {
  SkyProgressIndicatorDisplayMode
} from './types/progress-indicator-mode';

import {
  SkyProgressIndicatorItemStatus
} from './types/progress-indicator-item-status';

import {
  SkyProgressIndicatorMessage
} from './types/progress-indicator-message';

import {
  SkyProgressIndicatorMessageType
} from './types/progress-indicator-message-type';

@Component({
  selector: 'sky-progress-indicator',
  templateUrl: './progress-indicator.component.html',
  styleUrls: ['./progress-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyProgressIndicatorComponent implements OnInit, AfterContentInit, OnDestroy {

/**
 * Specifies whether to display the progress indicator vertically or horizontally.
 * For [passive progress indicators](https://developer.blackbaud.com/skyux-progress-indicator/docs/passive-indicator)
 * and [waterfall progress indicators](https://developer.blackbaud.com/skyux/components/progress-indicator/waterfall-progress-indicator),
 * use the vertical display mode. For [modal wizards](https://developer.blackbaud.com/skyux/components/wizard),
 * use the horizontal display mode.
 * @default vertical
 */
  @Input()
  public set displayMode(value: SkyProgressIndicatorDisplayMode) {
    this._displayMode = value;
  }

  public get displayMode(): SkyProgressIndicatorDisplayMode {
    if (this._displayMode === undefined) {
      return SkyProgressIndicatorDisplayMode.Vertical;
    }

    return this._displayMode;
  }

/**
 * Indicates whether the progress indicator is passive. Passive progress indicators inform users of
 * progress that concerns them but that they are not responsible for, and they must use the vertical display mode.
 * @default false
 */
  @Input()
  public set isPassive(value: boolean) {
    this._isPassive = value;
  }

  public get isPassive(): boolean {
    // Currently, passive mode is not supported for horizontal displays.
    if (this.displayMode === SkyProgressIndicatorDisplayMode.Horizontal) {
      return false;
    }

    return this._isPassive || false;
  }

/**
 * Specifies an observable of `SkyProgressIndicatorMessage` that determines the status to
 * display for items in the progress indicator. The message stream is a queue of
 * commanding messages to change the state of the progress indicator based on the message type.
 */
  @Input()
  public set messageStream(
    value: Subject<SkyProgressIndicatorMessage | SkyProgressIndicatorMessageType>
  ) {
    if (value) {
      this._messageStream = value;
    }
  }

/**
 * Specifies the index for the item to make active when the progress indicator
 * loads. All steps that precede the active item are marked as complete, and all steps
 * that follow the active item are marked as incomplete.
 */
  @Input()
  public set startingIndex(value: number) {
    this._startingIndex = value;
  }

  public get startingIndex(): number {
    return this._startingIndex || 0;
  }

/**
 * Fires when the progress indicator changes the status of an item.
 */
  @Output()
  public progressChanges = new EventEmitter<SkyProgressIndicatorChange>();

  public get cssClassNames(): string {
    const classNames = [
      `sky-progress-indicator-mode-${this.displayModeName}`
    ];

    if (this.isPassive) {
      classNames.push('sky-progress-indicator-passive');
    }

    return classNames.join(' ');
  }

  public get displayModeName(): string {
    if (this.displayMode === SkyProgressIndicatorDisplayMode.Vertical) {
      return 'vertical';
    }

    return 'horizontal';
  }

  public get hasFinishButton(): boolean {
    return this._hasFinishButton || false;
  }

  public set hasFinishButton(value: boolean) {
    this._hasFinishButton = value;
  }

  public get itemStatuses(): SkyProgressIndicatorItemStatus[] {
    if (!this.itemComponents) {
      return [];
    }

    return this.itemComponents.map(c => c.status);
  }

  @ContentChildren(SkyProgressIndicatorItemComponent)
  private itemComponents: QueryList<SkyProgressIndicatorItemComponent>;

  private get activeIndex(): number {
    return this._activeIndex || 0;
  }

  private set activeIndex(value: number) {
    const lastIndex = this.itemComponents.length - 1;

    let newIndex = value;

    if (value > lastIndex) {
      newIndex = lastIndex;
    } else if (value < 0) {
      newIndex = 0;
    }

    this._activeIndex = newIndex;
  }

  private ngUnsubscribe = new Subject<void>();

  private _activeIndex: number;
  private _displayMode: SkyProgressIndicatorDisplayMode;
  private _hasFinishButton: boolean;
  private _isPassive: boolean;
  private _messageStream = new Subject<SkyProgressIndicatorMessage | SkyProgressIndicatorMessageType>();
  private _startingIndex: number;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private windowRef: SkyAppWindowRef
  ) { }

  public ngOnInit(): void {
    this.subscribeToMessageStream();
  }

  public ngAfterContentInit(): void {
    this.activeIndex = this.startingIndex;

    this.updateSteps();

    // Note: The delay here is to ensure all change detection on the items has finished. Without
    // the delay we receive a changed before checked error for vertical progress indicators
    this.itemComponents.changes
      .pipe(
        takeUntil(this.ngUnsubscribe),
        delay(0)
      )
      .subscribe(() => {
        this.updateSteps();
        this.notifyChange();
      });

    // Wait for item components' change detection to complete
    // before notifying changes to the consumer.
    this.windowRef.nativeWindow.setTimeout(() => {
      this.notifyChange();
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public sendMessage(message: SkyProgressIndicatorMessage): void {
    this._messageStream.next(message);
  }

  private gotoNextStep(): void {
    const nextIndex = this.activeIndex + 1;
    const lastIndex = this.itemComponents.length - 1;

    if (nextIndex > lastIndex) {
      return;
    }

    this.gotoStep(nextIndex);
  }

  private gotoPreviousStep(): void {
    const previousIndex = this.activeIndex - 1;

    if (previousIndex < 0) {
      return;
    }

    this.gotoStep(previousIndex);
  }

  private gotoStep(index: number): void {
    this.activeIndex = index;
    this.updateSteps();
    this.notifyChange();
  }

  private finishSteps(): void {
    this.activeIndex = this.itemComponents.length - 1;

    this.itemComponents.forEach((component) => {
      component.status = SkyProgressIndicatorItemStatus.Complete;
    });

    this.notifyChange({
      isComplete: true
    });
  }

  private resetSteps(): void {
    this.gotoStep(0);
  }

  private updateSteps(): void {
    if (this.activeIndex > (this.itemComponents.length - 1)) {
      this.activeIndex--;
    }

    const activeIndex = this.activeIndex;
    const isPassive = this.isPassive;
    const isVertical = (this.displayMode === SkyProgressIndicatorDisplayMode.Vertical);

    this.itemComponents.forEach((component, i) => {

      // Set visibility.
      component.isVisible = (
        activeIndex === i ||
        isVertical
      );

      // Set status.
      let status: SkyProgressIndicatorItemStatus;
      if (activeIndex === i) {
        if (isPassive) {
          status = SkyProgressIndicatorItemStatus.Pending;
        } else {
          status = SkyProgressIndicatorItemStatus.Active;
        }
      } else if (activeIndex > i) {
        status = SkyProgressIndicatorItemStatus.Complete;
      } else {
        status = SkyProgressIndicatorItemStatus.Incomplete;
      }

      component.status = status;

      // Show or hide the status markers.
      component.showStatusMarker = isVertical;

      // Show or hide the step number.
      if (isPassive) {
        component.hideStepNumber();
      } else {
        component.showStepNumber(i + 1);
      }

      // If we're in passive mode, don't show titles for incomplete items.
      component.showTitle = !(
        isPassive &&
        activeIndex < i
      );
    });
  }

  private handleIncomingMessage(
    message: SkyProgressIndicatorMessage | SkyProgressIndicatorMessageType
  ): void {
    const value: any = message;

    let type: SkyProgressIndicatorMessageType;

    // Prints a deprecation warning if the consumer provides only `SkyProgressIndicatorMessageType`.
    if (value.type === undefined) {
      console.warn(
        '[Deprecation warning] The progress indicator component\'s `messageStream` input is set ' +
        'to `Subject<SkyProgressIndicatorMessageType>`. We will remove this deprecated type in ' +
        'the next major version release. Instead, set the `messageStream` input to a value of ' +
        '`Subject<SkyProgressIndicatorMessage>`.'
      );

      type = value;
    } else {
      type = value.type;
    }

    switch (type) {
      case SkyProgressIndicatorMessageType.Progress:
        this.gotoNextStep();
        break;

      case SkyProgressIndicatorMessageType.Regress:
        this.gotoPreviousStep();
        break;

      case SkyProgressIndicatorMessageType.Finish:
        this.finishSteps();
        break;

      case SkyProgressIndicatorMessageType.Reset:
        this.resetSteps();
        break;

      case SkyProgressIndicatorMessageType.GoTo:
        if (
          !value.data ||
          value.data.activeIndex === undefined
        ) {
          console.warn(
            'A message type of `SkyProgressIndicatorMessageType.GoTo` was passed to the progress ' +
            'indicator, but no step index was provided. You can pass the desired active ' +
            'index via:\n' +
            '{\n' +
            '  type: SkyProgressIndicatorMessageType.GoTo,\n' +
            '  data: { activeIndex: 0 }\n' +
            '}'
          );
          return;
        }

        this.gotoStep(value.data.activeIndex);
        break;

      default:
        break;
    }

    // Update the view after a message is received.
    this.changeDetector.markForCheck();
  }

  private subscribeToMessageStream(): void {
    this._messageStream
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((message) => {
        this.handleIncomingMessage(message);
      });
  }

  private notifyChange(change?: SkyProgressIndicatorChange): void {
    this.progressChanges.next(
      Object.assign({}, {
        activeIndex: this.activeIndex,
        itemStatuses: this.itemStatuses
      }, change)
    );
  }
}
