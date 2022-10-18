import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
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
  public active: boolean | undefined;

  /**
   * Fires when a sort item is selected.
   */
  @Output()
  public itemSelect: EventEmitter<any> = new EventEmitter(); // TODO: Change to `EventEmitter<void>` in a breaking change.

  public isSelected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  #subscription: Subscription | undefined;

  #sortItemId!: string;

  #sortService: SkySortService;
  #detector: ChangeDetectorRef;

  constructor(sortService: SkySortService, detector: ChangeDetectorRef) {
    this.#sortService = sortService;
    this.#detector = detector;
  }

  public ngOnInit(): void {
    sortItemIdNumber++;
    this.#sortItemId = SORT_ITEM_ID_PREFIX + sortItemIdNumber.toString();
    this.#subscription = this.#sortService.selectedItem.subscribe(
      (itemId: string) => {
        this.isSelected.next(itemId === this.#sortItemId);
        this.#detector.detectChanges();
      }
    );

    if (this.active) {
      this.#sortService.selectItem(this.#sortItemId);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes &&
      changes['active'] &&
      changes['active'].currentValue &&
      changes['active'].currentValue !== changes['active'].previousValue
    ) {
      this.#sortService.selectItem(this.#sortItemId);
    }
  }

  public itemClicked(): void {
    this.#sortService.selectItem(this.#sortItemId);
    this.itemSelect.emit();
  }

  public ngOnDestroy(): void {
    /* istanbul ignore else */
    /* sanity check */
    if (this.#subscription) {
      this.#subscription.unsubscribe();
    }
  }
}
