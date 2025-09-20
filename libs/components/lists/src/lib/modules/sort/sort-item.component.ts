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
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';

import { SkySortService } from './sort.service';

const SORT_ITEM_ID_PREFIX = 'sky-sort-item-';

let sortItemIdNumber = 0;

@Component({
  selector: 'sky-sort-item',
  templateUrl: './sort-item.component.html',
  styleUrls: ['./sort-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class SkySortItemComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Whether the sorting option is active.
   */
  @Input()
  public active: boolean | undefined;

  /**
   * Fires when a sort item is selected.
   */
  @Output()
  public itemSelect = new EventEmitter<any>(); // TODO: Change to `EventEmitter<void>` in a breaking change.

  public isSelected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );

  @ViewChild(TemplateRef<any>)
  public itemTemplate?: TemplateRef<any> | null;

  #subscription: Subscription | undefined;

  #sortItemId: string | undefined;

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
      },
    );

    if (this.active) {
      this.#sortService.selectItem(this.#sortItemId);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      this.#sortItemId &&
      changes &&
      changes['active'] &&
      changes['active'].currentValue &&
      changes['active'].currentValue !== changes['active'].previousValue
    ) {
      this.#sortService.selectItem(this.#sortItemId);
    }
  }

  public itemClicked(): void {
    if (this.#sortItemId) {
      this.#sortService.selectItem(this.#sortItemId);
      this.itemSelect.emit();
    }
  }

  public ngOnDestroy(): void {
    /* istanbul ignore else */
    /* sanity check */
    if (this.#subscription) {
      this.#subscription.unsubscribe();
    }
  }
}
