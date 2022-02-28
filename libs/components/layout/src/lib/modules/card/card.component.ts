import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { SkyCardTitleComponent } from './card-title.component';

import { SkyInlineDeleteComponent } from '../inline-delete/inline-delete.component';

import { SkyInlineDeleteType } from '../inline-delete/inline-delete-type';

/**
 * Creates a a small container to highlight important information.
 */
@Component({
  selector: 'sky-card',
  styleUrls: ['./card.component.scss'],
  templateUrl: './card.component.html',
})
export class SkyCardComponent implements AfterContentInit, OnDestroy {
  /**
   * Specifies the size of the card. The valid options are `"large"` and `"small"`.
   * @default "large"
   */
  @Input()
  public size: string;

  /**
   * Indicates whether to display a checkbox to the right of the card title.
   * Users can select multiple checkboxes and perform actions on the selected cards.
   * @default false
   */
  @Input()
  public selectable: boolean;

  /**
   * Indicates whether the card is selected. This only applies to card where
   * `selectable` is set to `true`.
   * @default false
   */
  @Input()
  public selected: boolean;

  /**
   * Fires when users select or deselect the card.
   */
  @Output()
  public selectedChange = new EventEmitter<boolean>();

  @ContentChildren(SkyInlineDeleteComponent)
  public inlineDeleteComponent: QueryList<SkyInlineDeleteComponent>;

  @ContentChildren(SkyCardTitleComponent)
  public titleComponent: QueryList<SkyCardTitleComponent>;

  public showTitle = true;

  private subscription: Subscription;

  public ngAfterContentInit() {
    this.showTitle = this.titleComponent.length > 0;

    this.subscription = this.titleComponent.changes.subscribe(() => {
      this.showTitle = this.titleComponent.length > 0;
    });

    this.inlineDeleteComponent.forEach((item) => {
      item.setType(SkyInlineDeleteType.Card);
    });

    this.inlineDeleteComponent.changes.subscribe(() => {
      this.inlineDeleteComponent.forEach((item) => {
        item.setType(SkyInlineDeleteType.Card);
      });
    });
  }

  public contentClick() {
    if (this.selectable) {
      this.selected = !this.selected;
      this.selectedChange.emit(this.selected);
    }
  }

  public onCheckboxChange(newValue: boolean) {
    if (this.selectable && this.selected !== newValue) {
      this.selected = newValue;
      this.selectedChange.emit(this.selected);
    }
  }

  public ngOnDestroy() {
    /* istanbul ignore else */
    /* sanity check */
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
