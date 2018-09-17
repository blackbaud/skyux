import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList
} from '@angular/core';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkyProgressIndicatorChange,
  SkyProgressIndicatorMessageType
} from './types';
import {
  SkyProgressIndicatorItemComponent
} from './progress-indicator-item';
import {
  SkyProgressIndicatorDisplayMode
} from './types/progress-indicator-mode';

@Component({
  selector: 'sky-progress-indicator',
  templateUrl: './progress-indicator.component.html',
  styleUrls: ['./progress-indicator.component.scss']
})
export class SkyProgressIndicatorComponent implements AfterContentInit, OnDestroy {

  @Input()
  public startingIndex: number;

  @Input()
  public get displayMode(): SkyProgressIndicatorDisplayMode {
    return this._displayMode || SkyProgressIndicatorDisplayMode.Vertical;
  }
  public set displayMode(value: SkyProgressIndicatorDisplayMode) {
    this._displayMode = value;
  }

  public get isHorizontal(): boolean {
    return this.displayMode === SkyProgressIndicatorDisplayMode.Horizontal;
  }

  @Input()
  public messageStream = new Subject<SkyProgressIndicatorMessageType>();

  @Output()
  public progressChanges = new EventEmitter<SkyProgressIndicatorChange>();

  @ContentChildren(SkyProgressIndicatorItemComponent)
  public progressItems: QueryList<SkyProgressIndicatorItemComponent>;

  private activeIndex = 0;
  private _displayMode: SkyProgressIndicatorDisplayMode;
  private ngUnsubscribe = new Subject();

  public ngAfterContentInit(): void {
    // Set up observation of progress command messages
    this.messageStream
      .takeUntil(this.ngUnsubscribe)
      .subscribe((messageType: SkyProgressIndicatorMessageType) => {
        switch (messageType) {
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
        this.progressChanges.emit({
          activeIndex: this.activeIndex
        });
      });

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
      if (firstItem) {
        firstItem.isActive = true;
      }
    }
    this.progressChanges.emit({
      activeIndex: this.activeIndex
    });

    // Set the last item
    const lastItem = this.getItemByIndex(this.progressItems.length - 1);
    if (lastItem) {
      lastItem.isLastItem = true;
    }

    // Set the horizontal state
    this.progressItems.forEach((element, index) => {
      element.displayMode = this.displayMode;
      element.itemNumber = index + 1;
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.unsubscribe();
  }

  public isNextToCheck(index: number): boolean {
    let nextItem = this.getItemByIndex(index + 1);
    return nextItem && nextItem.isComplete && !nextItem.isActive;
  }

  private progress(): void {
    if (this.activeIndex === this.progressItems.length) {
      return;
    }
    const completedItem = this.getItemByIndex(this.activeIndex);

    this.activeIndex += 1;
    const activeItem = this.getItemByIndex(this.activeIndex);

    if (completedItem) {
      completedItem.isActive = false;
      completedItem.isComplete = true;
      completedItem.isNextToInactive = false;
    }
    if (activeItem) {
      activeItem.isActive = true;
    }
  }

  private regress(): void {
    if (this.activeIndex === 0) {
      return;
    }
    const inactiveItem = this.getItemByIndex(this.activeIndex);

    this.activeIndex -= 1;
    const activeItem = this.getItemByIndex(this.activeIndex);

    if (inactiveItem) {
      inactiveItem.isActive = false;
    }
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
    if (firstItem) {
      firstItem.isActive = true;
    }
  }

  private getItemByIndex(index: number): SkyProgressIndicatorItemComponent {
    return this.progressItems.find((item: any, i: number) => {
      return (i === index);
    });
  }
}
