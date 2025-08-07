import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
} from '@angular/core';
import { SkyAppWindowRef, SkyLogService } from '@skyux/core';

import { Subject, Subscription } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

import { SkyProgressIndicatorItemComponent } from './progress-indicator-item/progress-indicator-item.component';
import { SkyProgressIndicatorChange } from './types/progress-indicator-change';
import { SkyProgressIndicatorDisplayModeType } from './types/progress-indicator-display-mode-type';
import { SkyProgressIndicatorItemStatus } from './types/progress-indicator-item-status';
import { SkyProgressIndicatorMessage } from './types/progress-indicator-message';
import { SkyProgressIndicatorMessageType } from './types/progress-indicator-message-type';
import { SkyProgressIndicatorDisplayMode } from './types/progress-indicator-mode';

@Component({
  selector: 'sky-progress-indicator',
  templateUrl: './progress-indicator.component.html',
  styleUrls: ['./progress-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyProgressIndicatorComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  /**
   * The orientation of the progress indicator, which can be vertical or horizontal.
   * For [passive progress indicators](https://developer.blackbaud.com/skyux-progress-indicator/docs/passive-indicator)
   * and [waterfall progress indicators](https://developer.blackbaud.com/skyux/components/progress-indicator/waterfall-progress-indicator),
   * use the vertical display mode. For [modal wizards](https://developer.blackbaud.com/skyux/components/wizard),
   * use the horizontal display mode.
   * @deprecated The property was designed to create wizards by setting `displayMode="horizontal"` on progress indicators in modals,
   * but this wizard implementation was replaced by the
   * [Wizard (Tabs) component](https://developer.blackbaud.com/skyux/components/progress-indicator).
   * @default "vertical"
   */
  @Input()
  public set displayMode(
    value: SkyProgressIndicatorDisplayModeType | undefined,
  ) {
    switch (value) {
      case SkyProgressIndicatorDisplayMode.Horizontal:
      case 'horizontal':
        this.#_displayMode = 'horizontal';
        break;
      default:
        this.#_displayMode = 'vertical';
    }

    this.#updateCssClassNames();

    if (this.#_displayMode === 'horizontal') {
      this.#logger.deprecated('SkyProgressIndicator wizard', {
        deprecationMajorVersion: 6,
        replacementRecommendation: 'Use Wizard (Tabs) instead.',
      });
    }
  }

  public get displayMode(): SkyProgressIndicatorDisplayModeType {
    return this.#_displayMode;
  }

  /**
   * Whether the progress indicator is passive. Passive progress indicators inform users of
   * progress that concerns them but that they are not responsible for, and they must use the vertical display mode.
   * @default false
   */
  @Input()
  public set isPassive(value: boolean | undefined) {
    this.#_isPassive = value;
    this.#updateCssClassNames();
  }

  public get isPassive(): boolean | undefined {
    return this.#_isPassive;
  }

  /**
   * The observable of `SkyProgressIndicatorMessage` that determines the status to
   * display for items in the progress indicator. The message stream is a queue of
   * commanding messages to change the state of the progress indicator based on the message type.
   */
  @Input()
  public set messageStream(
    value:
      | Subject<SkyProgressIndicatorMessage | SkyProgressIndicatorMessageType>
      | undefined,
  ) {
    this.#messageStream = value || new Subject();
    this.#subscribeToMessageStream();
  }

  /**
   * The index for the item to make active when the progress indicator
   * loads. All steps that precede the active item are marked as complete, and all steps
   * that follow the active item are marked as incomplete.
   */
  @Input()
  public set startingIndex(value: number | undefined) {
    this.#_startingIndex = value || 0;
  }

  public get startingIndex(): number {
    return this.#_startingIndex;
  }

  /**
   * Fires when the progress indicator changes the status of an item.
   */
  @Output()
  public progressChanges = new EventEmitter<SkyProgressIndicatorChange>();

  public get hasFinishButton(): boolean | undefined {
    return this.#_hasFinishButton;
  }

  public set hasFinishButton(value: boolean | undefined) {
    this.#_hasFinishButton = value;
  }

  @ContentChildren(SkyProgressIndicatorItemComponent)
  public itemComponents:
    | QueryList<SkyProgressIndicatorItemComponent>
    | undefined;

  public cssClassNames: string[] = [];
  public itemStatuses: SkyProgressIndicatorItemStatus[] = [];

  set #activeIndex(value: number | undefined) {
    const lastIndex = (this.itemComponents?.length || 0) - 1;
    this.#_activeIndex = Math.max(Math.min(value || 0, lastIndex), 0);
  }

  get #activeIndex(): number {
    return this.#_activeIndex;
  }

  #_activeIndex = 0;
  #_displayMode: SkyProgressIndicatorDisplayModeType = 'vertical';
  #_hasFinishButton: boolean | undefined;
  #_isPassive: boolean | undefined = false;
  #_startingIndex = 0;

  #messageStreamSub: Subscription | undefined;
  #initialized = false;
  #ngUnsubscribe = new Subject<void>();
  #messageStream = new Subject<
    SkyProgressIndicatorMessage | SkyProgressIndicatorMessageType
  >();
  #changeDetector: ChangeDetectorRef;
  #windowRef: SkyAppWindowRef;
  #logger: SkyLogService;

  constructor(
    changeDetector: ChangeDetectorRef,
    windowRef: SkyAppWindowRef,
    logger: SkyLogService,
  ) {
    this.#changeDetector = changeDetector;
    this.#windowRef = windowRef;
    this.#logger = logger;
  }

  public ngOnInit(): void {
    this.#initialized = true;

    this.#updateCssClassNames();
    this.#subscribeToMessageStream();
  }

  public ngAfterContentInit(): void {
    this.#activeIndex = this.startingIndex;

    this.#updateSteps();

    // Note: The delay here is to ensure all change detection on the items has finished. Without
    // the delay we receive a changed before checked error for vertical progress indicators
    this.itemComponents?.changes
      .pipe(takeUntil(this.#ngUnsubscribe), delay(0))
      .subscribe(() => {
        this.#updateSteps();
        this.#updateStatusesAndNotify();
      });

    // Wait for item components' change detection to complete
    // before notifying changes to the consumer.
    this.#windowRef.nativeWindow.setTimeout(() => {
      this.#updateStatusesAndNotify();
    });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public sendMessage(message: SkyProgressIndicatorMessage): void {
    this.#messageStream.next(message);
  }

  #isPassiveAndVertical(): boolean | undefined {
    // Currently, passive mode is not supported for horizontal displays.
    if (this.displayMode === 'horizontal') {
      return false;
    }

    return this.isPassive;
  }

  #gotoNextStep(): void {
    const nextIndex = this.#activeIndex + 1;
    const lastIndex = this.#getLastIndex();

    if (nextIndex > lastIndex) {
      return;
    }

    this.#gotoStep(nextIndex);
  }

  #gotoPreviousStep(): void {
    const previousIndex = this.#activeIndex - 1;

    if (previousIndex < 0) {
      return;
    }

    this.#gotoStep(previousIndex);
  }

  #gotoStep(index: number): void {
    this.#activeIndex = index;
    this.#updateSteps();
    this.#updateStatusesAndNotify();
  }

  #finishSteps(): void {
    this.#activeIndex = this.#getLastIndex();

    this.itemComponents?.forEach((component) => {
      component.status = SkyProgressIndicatorItemStatus.Complete;
    });

    this.#updateStatusesAndNotify({
      isComplete: true,
    });
  }

  #resetSteps(): void {
    this.#gotoStep(0);
  }

  #updateSteps(): void {
    if (this.#activeIndex > this.#getLastIndex()) {
      this.#activeIndex = this.#activeIndex - 1;
    }

    const activeIndex = this.#activeIndex;
    const isPassiveAndVertical = this.#isPassiveAndVertical();
    const isVertical = this.displayMode === 'vertical';

    this.itemComponents?.forEach((component, i) => {
      // Set visibility.
      component.isVisible = activeIndex === i || isVertical;

      // Set status.
      let status: SkyProgressIndicatorItemStatus;
      if (activeIndex === i) {
        if (isPassiveAndVertical) {
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
      if (isPassiveAndVertical) {
        component.hideStepNumber();
      } else {
        component.showStepNumber(i + 1);
      }

      // If we're in passive mode, don't show titles for incomplete items.
      component.showTitle = !(isPassiveAndVertical && activeIndex < i);
    });
  }

  #updateItemStatuses(): void {
    /* istanbul ignore next */
    this.itemStatuses = this.itemComponents?.map((c) => c.status) || [];
  }

  #updateCssClassNames(): void {
    const classNames = [`sky-progress-indicator-mode-${this.displayMode}`];

    if (this.#isPassiveAndVertical()) {
      classNames.push('sky-progress-indicator-passive');
    }

    this.cssClassNames = classNames;
  }

  #handleIncomingMessage(
    message: SkyProgressIndicatorMessage | SkyProgressIndicatorMessageType,
  ): void {
    const indicatorMessage = message as SkyProgressIndicatorMessage;

    let type: SkyProgressIndicatorMessageType;

    // Prints a deprecation warning if the consumer provides only `SkyProgressIndicatorMessageType`.
    if (indicatorMessage.type === undefined) {
      console.warn(
        "[Deprecation warning] The progress indicator component's `messageStream` input is set " +
          'to `Subject<SkyProgressIndicatorMessageType>`. We will remove this deprecated type in ' +
          'the next major version release. Instead, set the `messageStream` input to a value of ' +
          '`Subject<SkyProgressIndicatorMessage>`.',
      );

      type = message as SkyProgressIndicatorMessageType;
    } else {
      type = indicatorMessage.type;
    }

    switch (type) {
      case SkyProgressIndicatorMessageType.Progress:
        this.#gotoNextStep();
        break;

      case SkyProgressIndicatorMessageType.Regress:
        this.#gotoPreviousStep();
        break;

      case SkyProgressIndicatorMessageType.Finish:
        this.#finishSteps();
        break;

      case SkyProgressIndicatorMessageType.Reset:
        this.#resetSteps();
        break;

      case SkyProgressIndicatorMessageType.GoTo:
        if (
          !indicatorMessage.data ||
          indicatorMessage.data.activeIndex === undefined
        ) {
          console.warn(
            'A message type of `SkyProgressIndicatorMessageType.GoTo` was passed to the progress ' +
              'indicator, but no step index was provided. You can pass the desired active ' +
              'index via:\n' +
              '{\n' +
              '  type: SkyProgressIndicatorMessageType.GoTo,\n' +
              '  data: { activeIndex: 0 }\n' +
              '}',
          );
          return;
        }

        this.#gotoStep(indicatorMessage.data.activeIndex);
        break;

      default:
        break;
    }

    // Update the view after a message is received.
    this.#changeDetector.markForCheck();
  }

  #subscribeToMessageStream(): void {
    if (this.#initialized) {
      if (this.#messageStreamSub) {
        this.#messageStreamSub.unsubscribe();
        this.#messageStreamSub = undefined;
      }

      if (this.#messageStream) {
        this.#messageStreamSub = this.#messageStream
          .pipe(takeUntil(this.#ngUnsubscribe))
          .subscribe((message) => {
            this.#handleIncomingMessage(message);
          });
      }
    }
  }

  #updateStatusesAndNotify(change?: SkyProgressIndicatorChange): void {
    this.#updateItemStatuses();

    this.progressChanges.next(
      Object.assign(
        {},
        {
          activeIndex: this.#activeIndex,
          itemStatuses: this.itemStatuses,
        },
        change,
      ),
    );
  }

  #getLastIndex(): number {
    return (this.itemComponents?.length || 0) - 1;
  }
}
