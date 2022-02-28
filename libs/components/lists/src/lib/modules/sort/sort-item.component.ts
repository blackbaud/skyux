import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';

import { SkySortService } from './sort.service';

const SORT_ITEM_ID_PREFIX = 'sky-sort-item-';

let sortItemIdNumber = 0;

@Component({
  selector: 'sky-sort-item',
  styleUrls: ['./sort-item.component.scss'],
  templateUrl: './sort-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkySortItemComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Indicates whether the sorting option is active.
   */
  @Input()
  public active: boolean;

  /**
   * Fires when a sort item is selected.
   */
  @Output()
  public itemSelect: EventEmitter<any> = new EventEmitter();

  public isSelected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  private subscription: Subscription;

  private sortItemId: string;

  constructor(
    private sortService: SkySortService,
    private detector: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    sortItemIdNumber++;
    this.sortItemId = SORT_ITEM_ID_PREFIX + sortItemIdNumber.toString();
    this.subscription = this.sortService.selectedItem.subscribe(
      (itemId: string) => {
        this.isSelected.next(itemId === this.sortItemId);
        this.detector.detectChanges();
      }
    );

    if (this.active) {
      this.sortService.selectItem(this.sortItemId);
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (
      changes &&
      changes['active'] &&
      changes['active'].currentValue &&
      changes['active'].currentValue !== changes['active'].previousValue
    ) {
      this.sortService.selectItem(this.sortItemId);
    }
  }

  public itemClicked() {
    this.sortService.selectItem(this.sortItemId);
    this.itemSelect.emit();
  }

  public ngOnDestroy() {
    /* istanbul ignore else */
    /* sanity check */
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
