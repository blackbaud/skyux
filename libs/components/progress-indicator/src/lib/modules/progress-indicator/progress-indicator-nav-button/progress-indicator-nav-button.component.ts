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

import { SkyProgressIndicatorComponent } from '../progress-indicator.component';
import { SkyProgressIndicatorActionClickArgs } from '../types/progress-indicator-action-click-args';
import { SkyProgressIndicatorActionClickProgressHandler } from '../types/progress-indicator-action-click-progress-handler';
import { SkyProgressIndicatorChange } from '../types/progress-indicator-change';
import { SkyProgressIndicatorMessageType } from '../types/progress-indicator-message-type';
import { SkyProgressIndicatorNavButtonType } from '../types/progress-indicator-nav-button-type';

const BUTTON_TYPE_DEFAULT: SkyProgressIndicatorNavButtonType = 'next';

/**
 * Displays a button to navigate the steps in modal wizards. We recommend against using it in
 * passive progress indicators and waterfall progress indicators.
 */
@Component({
  selector: 'sky-progress-indicator-nav-button',
  templateUrl: './progress-indicator-nav-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyProgressIndicatorNavButtonComponent
  implements AfterViewInit, OnDestroy
{
  /**
   * The label to display on the nav button.
   * @default "Next"
   */
  @Input()
  public buttonText: string | undefined;

  /**
   * The type of nav button to include.
   * @default "next"
   */
  @Input()
  public set buttonType(value: SkyProgressIndicatorNavButtonType | undefined) {
    this.#_buttonType = value || BUTTON_TYPE_DEFAULT;
  }

  public get buttonType(): SkyProgressIndicatorNavButtonType {
    return this.#_buttonType;
  }

  /**
   * Whether to disable the nav button.
   * @default false
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    this.#_disabled = value;
    this.#changeDetector.markForCheck();
  }

  public get disabled(): boolean | undefined {
    return this.#_disabled;
  }

  /**
   * The progress indicator component to associate with the nav button.
   * @required
   */
  @Input()
  public set progressIndicator(
    value: SkyProgressIndicatorComponent | undefined,
  ) {
    this.#_progressIndicator = value;

    if (this.#_progressIndicator) {
      if (this.buttonType === 'finish') {
        // The `hasFinishButton` field was added to support legacy API.
        // Some implementations only include a next button; we cannot
        // assume that every implementation includes both a finish button and a next button.
        this.#_progressIndicator.hasFinishButton = true;
      }

      this.#_progressIndicator.progressChanges
        .pipe(distinctUntilChanged(), takeUntil(this.#ngUnsubscribe))
        .subscribe((change: SkyProgressIndicatorChange) => {
          this.lastProgressChange = change;
          this.#updateButtonVisibility(change);
        });
    } else {
      if (!this.#parentTimeout) {
        this.#parentTimeout = window.setTimeout(() => {
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
                '</sky-progress-indicator-nav-button>',
            );
          }
        }, 50);
      }
    }
  }

  public get progressIndicator(): SkyProgressIndicatorComponent | undefined {
    return this.#_progressIndicator;
  }

  /**
   * Fires when users select the nav button and emits a `SkyProgressIndicatorActionClickArgs`
   * object that is passed into the callback function to allow consumers to decide whether
   * the button’s action should complete successfully.
   */
  @Output()
  public actionClick = new EventEmitter<SkyProgressIndicatorActionClickArgs>();

  public set isVisible(value: boolean | undefined) {
    this.#_isVisible = value;
    this.#changeDetector.markForCheck();
  }

  public get isVisible(): boolean | undefined {
    return this.#_isVisible;
  }

  public lastProgressChange: SkyProgressIndicatorChange | undefined;

  #ngUnsubscribe = new Subject<void>();
  #parentTimeout: number | undefined;

  #_buttonType = BUTTON_TYPE_DEFAULT;
  #_disabled: boolean | undefined;
  #_isVisible: boolean | undefined;
  #_progressIndicator: SkyProgressIndicatorComponent | undefined;

  #changeDetector: ChangeDetectorRef;
  #parentComponent: SkyProgressIndicatorComponent | undefined;

  constructor(
    changeDetector: ChangeDetectorRef,
    @Optional() parentComponent?: SkyProgressIndicatorComponent,
  ) {
    this.#changeDetector = changeDetector;
    this.#parentComponent = parentComponent;
  }

  public ngAfterViewInit(): void {
    if (!this.progressIndicator && this.#parentComponent) {
      this.progressIndicator = this.#parentComponent;
    } else if (!this.progressIndicator) {
      this.progressIndicator = undefined;
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
    this.actionClick.complete();
  }

  public onClick(event: MouseEvent): void {
    event.preventDefault();

    let type: SkyProgressIndicatorMessageType | undefined;

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
    }

    // If the consumer has subscribed to the `actionClick` event,
    // allow them to decide when to advance to the next step.
    if (this.actionClick.observers.length > 0) {
      this.actionClick.emit({
        event,
        progressHandler: new SkyProgressIndicatorActionClickProgressHandler(
          () => {
            this.#sendMessage(type);
          },
        ),
      });
    } else {
      this.#sendMessage(type);
    }
  }

  #sendMessage(type: SkyProgressIndicatorMessageType | undefined): void {
    if (type !== undefined) {
      this.progressIndicator?.sendMessage({ type });
    }
  }

  #updateButtonVisibility(change: SkyProgressIndicatorChange): void {
    const isLastStep =
      change.itemStatuses &&
      change.activeIndex === change.itemStatuses.length - 1;
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
      this.progressIndicator?.hasFinishButton
    ) {
      this.isVisible = false;
      return;
    }

    this.isVisible = true;
  }
}
