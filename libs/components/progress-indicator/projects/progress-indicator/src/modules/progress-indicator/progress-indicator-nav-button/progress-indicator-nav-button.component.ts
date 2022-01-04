import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output,
} from '@angular/core';

import { Subject } from 'rxjs';

import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { SkyProgressIndicatorActionClickArgs } from '../types/progress-indicator-action-click-args';

import { SkyProgressIndicatorActionClickProgressHandler } from '../types/progress-indicator-action-click-progress-handler';

import { SkyProgressIndicatorChange } from '../types/progress-indicator-change';

import { SkyProgressIndicatorMessageType } from '../types/progress-indicator-message-type';

import { SkyProgressIndicatorNavButtonType } from '../types/progress-indicator-nav-button-type';

import { SkyProgressIndicatorComponent } from '../progress-indicator.component';

/**
 * Displays a button to navigate the steps in modal wizards. We recommend against using it in
 * passive progress indicators and waterfall progress indicators.
 */
@Component({
  selector: 'sky-progress-indicator-nav-button',
  templateUrl: './progress-indicator-nav-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyProgressIndicatorNavButtonComponent
  implements AfterViewInit, OnDestroy
{
  /**
   * Specifies the label to display on the nav button.
   * @default 'Next'
   */
  @Input()
  public buttonText: string;

  /**
   * Specifies the type of nav button to include.
   * The valid options are `finish`, `next`, `previous`, and `reset`.
   * @default next
   */
  @Input()
  public set buttonType(value: SkyProgressIndicatorNavButtonType) {
    this._buttonType = value;
  }

  public get buttonType(): SkyProgressIndicatorNavButtonType {
    if (this._buttonType === undefined) {
      return 'next';
    }

    return this._buttonType;
  }

  /**
   * Indicates whether to disable the nav button.
   * @default false
   */
  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
    this.changeDetector.markForCheck();
  }

  public get disabled(): boolean {
    const buttonType = this.buttonType;
    const activeIndex = this.lastProgressChange.activeIndex;
    const isLastStep =
      activeIndex === this.lastProgressChange.itemStatuses.length - 1;

    if (buttonType === 'previous' && activeIndex === 0) {
      return true;
    }

    if (buttonType === 'next' && isLastStep) {
      return true;
    }

    return this._disabled || false;
  }

  /**
   * Specifies the progress indicator component to associate with the nav button.
   * @required
   */
  @Input()
  public set progressIndicator(value: SkyProgressIndicatorComponent) {
    this._progressIndicator = value;

    if (value) {
      if (this.buttonType === 'finish') {
        // The `hasFinishButton` field was added to support legacy API.
        // Some implementations only include a next button; we cannot
        // assume that every implementation includes both a finish button and a next button.
        this._progressIndicator.hasFinishButton = true;
      }

      this._progressIndicator.progressChanges
        .pipe(distinctUntilChanged(), takeUntil(this.ngUnsubscribe))
        .subscribe((change: SkyProgressIndicatorChange) => {
          this.lastProgressChange = change;
          this.updateButtonVisibility(change);
        });
    } else {
      if (!this.parentTimeout) {
        this.parentTimeout = window.setTimeout(() => {
          /* istanbul ignore else */
          if (!this.progressIndicator) {
            throw new Error(
              'The `<sky-progress-indicator-nav-button>` component requires a reference to ' +
                'the `<sky-progress-indicator>` component it controls. For example:\n' +
                '<sky-progress-indicator\n' +
                '  #myProgressIndicator\n' +
                '>\n' +
                '</sky-progress-indicator>\n' +
                '<sky-progress-indicator-nav-button\n' +
                '  [progressIndicator]="myProgressIndicator"\n' +
                '>\n' +
                '</sky-progress-indicator-nav-button>'
            );
          }
        }, 50);
      }
    }
  }

  public get progressIndicator(): SkyProgressIndicatorComponent {
    return this._progressIndicator;
  }

  /**
   * Fires when users select the nav button and emits a `SkyProgressIndicatorActionClickArgs`
   * object that is passed into the callback function to allow consumers to decide whether
   * the button’s action should complete successfully.
   */
  @Output()
  public actionClick = new EventEmitter<SkyProgressIndicatorActionClickArgs>();

  public get cssClassNames(): string {
    const buttonType = this.buttonType;

    const classNames = [`sky-progress-indicator-nav-button-${this.buttonType}`];

    switch (buttonType) {
      case 'next':
      case 'finish':
        classNames.push('sky-btn-primary');
        break;

      case 'reset':
        classNames.push('sky-btn-link');
        break;

      default:
        classNames.push('sky-btn-default');
        break;
    }

    return classNames.join(' ');
  }

  public get buttonLabelResourceString(): string {
    return `skyux_progress_indicator_navigator_${this.buttonType}`;
  }

  public set isVisible(value: boolean) {
    this._isVisible = value;
    this.changeDetector.markForCheck();
  }

  public get isVisible(): boolean {
    return this._isVisible || false;
  }

  private lastProgressChange: SkyProgressIndicatorChange;
  private ngUnsubscribe = new Subject<void>();
  private parentTimeout: number;

  private _buttonType: SkyProgressIndicatorNavButtonType;
  private _disabled: boolean;
  private _isVisible: boolean;
  private _progressIndicator: SkyProgressIndicatorComponent;

  constructor(
    private changeDetector: ChangeDetectorRef,
    @Optional() private parentComponent: SkyProgressIndicatorComponent
  ) {}

  public ngAfterViewInit(): void {
    if (!this.progressIndicator && this.parentComponent) {
      this.progressIndicator = this.parentComponent;
    } else if (!this.progressIndicator) {
      this.progressIndicator = undefined;
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.actionClick.complete();
  }

  public onClick(event: MouseEvent): void {
    event.preventDefault();

    let type: SkyProgressIndicatorMessageType;

    switch (this.buttonType) {
      case 'finish':
        type = SkyProgressIndicatorMessageType.Finish;
        break;

      case 'next':
        type = SkyProgressIndicatorMessageType.Progress;
        break;

      case 'previous':
        type = SkyProgressIndicatorMessageType.Regress;
        break;

      case 'reset':
        type = SkyProgressIndicatorMessageType.Reset;
        break;

      default:
        break;
    }

    // If the consumer has subscribed to the `actionClick` event,
    // allow them to decide when to advance to the next step.
    if (this.actionClick.observers.length > 0) {
      this.actionClick.emit({
        event,
        progressHandler: new SkyProgressIndicatorActionClickProgressHandler(
          () => {
            this.progressIndicator.sendMessage({ type });
          }
        ),
      });
    } else {
      this.progressIndicator.sendMessage({ type });
    }
  }

  private updateButtonVisibility(change: SkyProgressIndicatorChange): void {
    const isLastStep = change.activeIndex === change.itemStatuses.length - 1;
    const buttonType = this.buttonType;

    // Hide the button if all steps are complete
    // (except for the reset button)
    if (buttonType !== 'reset' && change.isComplete) {
      this.isVisible = false;
      return;
    }

    if (buttonType === 'finish') {
      this.isVisible = isLastStep;
      return;
    }

    // Hide the next button on the last step only if a finish button exists.
    if (
      buttonType === 'next' &&
      isLastStep &&
      this.progressIndicator.hasFinishButton
    ) {
      this.isVisible = false;
      return;
    }

    this.isVisible = true;
  }
}
