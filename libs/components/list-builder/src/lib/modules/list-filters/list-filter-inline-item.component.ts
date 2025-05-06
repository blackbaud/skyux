import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnInit,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { ListItemModel } from '@skyux/list-builder-common';

/**
 * Creates a filter in the list's inline filter area.
 * @deprecated
 */
@Component({
  selector: 'sky-list-filter-inline-item',
  template: '<ng-content />',
  standalone: false,
})
export class SkyListFilterInlineItemComponent implements OnInit {
  /**
   * The name of the filter.
   * @required
   */
  @Input()
  public name: string;

  /**
   * The current value of the filter.
   */
  @Input()
  public value: any;

  /**
   * The default value of the filter. If the value of the filter
   * is set to the default value, then the filter is not applied.
   */
  @Input()
  public defaultValue: any;

  /**
   * The function that determines whether an item is filtered.
   * This property is required when using an in-memory data provider. For information
   * about `ListItemModel`, see the
   * [shared classes for lists](https://developer.blackbaud.com/skyux-list-builder-common/docs/list-builder-common).
   */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('filter')
  public filterFunction: (item: ListItemModel, filter: any) => boolean;

  /**
   * The template for the filter. The template can access the `filter`
   * variable that contains the `value` of the filter control, which should be bound to
   * `ngModel`, and the `changed` function, which should be called when the model changes.
   * @required
   */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('template')
  public templateInput: TemplateRef<unknown>;

  public onChange: EventEmitter<any> = new EventEmitter<any>();

  @ContentChildren(TemplateRef)
  private templates: QueryList<TemplateRef<unknown>>;

  public ngOnInit(): void {
    if (this.name === undefined || this.name.length === 0) {
      throw new Error('Inline filter requires a name.');
    }
  }

  public get template(): TemplateRef<unknown> {
    return this.templates.length > 0
      ? this.templates.first
      : this.templateInput;
  }
}
