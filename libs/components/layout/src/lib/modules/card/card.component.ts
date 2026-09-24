import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { SkyInlineDeleteType } from '../inline-delete/inline-delete-type';
import { SkyInlineDeleteComponent } from '../inline-delete/inline-delete.component';

import { SkyCardTitleComponent } from './card-title.component';

/**
 * Creates a small container to highlight important information.
 */
@Component({
  selector: 'sky-card',
  styleUrls: ['./card.component.scss'],
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyCardComponent implements AfterContentInit, OnDestroy {
  /**
   * The size of the card. The valid options are `"large"` and `"small"`.
   * @default "large"
   */
  @Input()
  public set size(value: string | undefined) {
    this.#_size = value ?? 'large';
  }

  public get size(): string {
    return this.#_size;
  }

  /**
   * Whether to display a checkbox to the right of the card title.
   * Users can select multiple checkboxes and perform actions on the selected cards.
   * @default false
   */
  @Input()
  public selectable: boolean | undefined = false;

  /**
   * Whether the card is selected. This only applies to card where
   * `selectable` is set to `true`.
   * @default false
   */
  @Input()
  public selected: boolean | undefined = false;

  /**
   * Fires when users select or deselect the card.
   */
  @Output()
  public selectedChange = new EventEmitter<boolean>();

  @ContentChildren(SkyInlineDeleteComponent)
  public inlineDeleteComponent: QueryList<SkyInlineDeleteComponent> | undefined;

  @ContentChildren(SkyCardTitleComponent)
  public titleComponent: QueryList<SkyCardTitleComponent> | undefined;

  public showTitle = true;

  #subscription: Subscription | undefined;
  #_size = 'large';

  public ngAfterContentInit(): void {
    this.showTitle = !!this.titleComponent && this.titleComponent.length > 0;

    this.#subscription = this.titleComponent?.changes.subscribe(() => {
      this.showTitle = !!this.titleComponent && this.titleComponent.length > 0;
    });

    this.inlineDeleteComponent?.forEach((item) => {
      item.setType(SkyInlineDeleteType.Card);
    });

    this.inlineDeleteComponent?.changes.subscribe(() => {
      this.inlineDeleteComponent?.forEach((item) => {
        item.setType(SkyInlineDeleteType.Card);
      });
    });
  }

  public contentClick(): void {
    if (this.selectable) {
      this.selected = !this.selected;
      this.selectedChange.emit(this.selected);
    }
  }

  public onCheckboxChange(newValue: boolean): void {
    if (this.selectable && this.selected !== newValue) {
      this.selected = newValue;
      this.selectedChange.emit(this.selected);
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
