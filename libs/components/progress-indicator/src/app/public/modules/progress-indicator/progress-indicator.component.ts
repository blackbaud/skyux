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
  QueryList
} from '@angular/core';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/takeUntil';

import {
  SkyProgressIndicatorItemComponent
} from './progress-indicator-item/progress-indicator-item.component';

import {
  SkyProgressIndicatorChange,
  SkyProgressIndicatorDisplayMode,
  SkyProgressIndicatorMessage,
  SkyProgressIndicatorMessageType
} from './types';

@Component({
  selector: 'sky-progress-indicator',
  templateUrl: './progress-indicator.component.html',
  styleUrls: ['./progress-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyProgressIndicatorComponent implements OnInit, AfterContentInit, OnDestroy {
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

  public get isHorizontal(): boolean {
    return this.displayMode === SkyProgressIndicatorDisplayMode.Horizontal;
  }

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

  @Input()
  public set messageStream(
    value: Subject<SkyProgressIndicatorMessage | SkyProgressIndicatorMessageType>
  ) {
    /* istanbul ignore else */
    if (value) {
      this._messageStream = value;
    }
  }

  @Input()
  public set startingIndex(value: number) {
    this._startingIndex = value;
  }

  public get startingIndex(): number {
    return this._startingIndex || 0;
  }

  @Output()
  public progressChanges = new EventEmitter<SkyProgressIndicatorChange>();

  @ContentChildren(SkyProgressIndicatorItemComponent)
  public progressItems: QueryList<SkyProgressIndicatorItemComponent>;

  private get activeIndex(): number {
    return this._activeIndex || 0;
  }

  private set activeIndex(value: number) {
    const lastIndex = this.progressItems.length - 1;

    let newIndex = value;

    if (value > lastIndex) {
      newIndex = lastIndex;
    } else if (value < 0) {
      newIndex = 0;
    }

    this._activeIndex = newIndex;
  }

  private ngUnsubscribe = new Subject();

  private _activeIndex: number;
  private _displayMode: SkyProgressIndicatorDisplayMode;
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

    // Set the initial index
    if (this.startingIndex && this.startingIndex < this.progressItems.length) {
      this.activeIndex = this.startingIndex;

      const startingItem = this.getItemByIndex(this.startingIndex);
      startingItem.isActive = true;

      this.progressItems.forEach((item, index) => {
        if (index < this.startingIndex) {
          item.isComplete = true;
          item.isNextToInactive = false;
        }
      });
    } else {
      const firstItem = this.getItemByIndex(this.activeIndex);

      /* istanbul ignore else */
      if (firstItem) {
        firstItem.isActive = true;
      }
    }

    // Set the last item
    const lastItem = this.getItemByIndex(this.progressItems.length - 1);
    if (lastItem) {
      lastItem.isLastItem = true;
    }

    // Set the horizontal state
    this.progressItems.forEach((element, index) => {
      element.displayMode = this.displayMode;
      element.itemNumber = index + 1;
      element.isPassive = this.isPassive;
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

  public isNextToCheck(index: number): boolean {
    let nextItem = this.getItemByIndex(index + 1);
    return nextItem && nextItem.isComplete && !nextItem.isActive;
  }

  private progress(): void {
    /* istanbul ignore next */
    if (this.activeIndex === this.progressItems.length) {
      return;
    }

    const completedItem = this.getItemByIndex(this.activeIndex);

    this.activeIndex += 1;
    const activeItem = this.getItemByIndex(this.activeIndex);

    /* istanbul ignore else */
    if (completedItem) {
      completedItem.isActive = false;
      completedItem.isComplete = true;
      completedItem.isNextToInactive = false;
    }

    /* istanbul ignore else */
    if (activeItem) {
      activeItem.isActive = true;
    }
  }

  private regress(): void {
    /* istanbul ignore else */
    if (this.activeIndex === 0) {
      return;
    }

    const inactiveItem = this.getItemByIndex(this.activeIndex);

    this.activeIndex -= 1;
    const activeItem = this.getItemByIndex(this.activeIndex);

    /* istanbul ignore else */
    if (inactiveItem) {
      inactiveItem.isActive = false;
    }

    /* istanbul ignore else */
    if (activeItem) {
      activeItem.isActive = true;

      if (inactiveItem && !inactiveItem.isComplete) {
        activeItem.isNextToInactive = true;
      }
    }
  }

  private resetProgress(): void {
    this.activeIndex = 0;
    this.progressItems.forEach((item: SkyProgressIndicatorItemComponent) => {
      item.isActive = false;
      item.isComplete = false;
      item.isNextToInactive = true;
    });
    const firstItem = this.getItemByIndex(this.activeIndex);

    /* istanbul ignore else */
    if (firstItem) {
      firstItem.isActive = true;
    }
  }

  private getItemByIndex(index: number): SkyProgressIndicatorItemComponent {
    return this.progressItems.find((item: any, i: number) => {
      return (i === index);
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
        this.progress();
        break;

      case SkyProgressIndicatorMessageType.Regress:
        this.regress();
        break;

      case SkyProgressIndicatorMessageType.Reset:
        this.resetProgress();
        break;

      default:
        throw 'SkyProgressIndicatorMessageType unrecognized.';
    }

    this.changeDetector.markForCheck();
    this.notifyChange();
  }

  private subscribeToMessageStream(): void {
    this._messageStream
      .takeUntil(this.ngUnsubscribe)
      .subscribe((message) => {
        this.handleIncomingMessage(message);
      });
  }

  private notifyChange(change?: SkyProgressIndicatorChange): void {
    this.progressChanges.next(
      Object.assign({}, {
        activeIndex: this.activeIndex
      }, change)
    );
  }
}
