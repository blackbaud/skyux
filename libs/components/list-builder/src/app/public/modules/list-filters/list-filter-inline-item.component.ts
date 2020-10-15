import {
  Component,
  Input,
  ContentChildren,
  TemplateRef,
  QueryList,
  OnInit,
  EventEmitter
} from '@angular/core';

import {
  ListItemModel
} from '@skyux/list-builder-common';

/**
 * Creates a filter in the list's inline filter area.
 */
@Component({
  selector: 'sky-list-filter-inline-item',
  template: '<ng-content></ng-content>'
})
export class SkyListFilterInlineItemComponent implements OnInit {
  /**
   * Specifies the name of the filter.
   * @required
   */
  @Input()
  public name: string;

  /**
   * Specifies the current value of the filter.
   */
  @Input()
  public value: any;

  /**
   * Specifies the default value of the filter. If the value of the filter
   * is set to the default value, then the filter is not applied.
   */
  @Input()
  public defaultValue: any;

  /**
   * Specifies the function to apply to determine whether an item is filtered.
   * This property is required when using an in-memory data provider. For information
   * about `ListItemModel`, see the
   * [shared classes for lists](https://developer.blackbaud.com/skyux-list-builder-common/docs/list-builder-common).
   */
  /* tslint:disable:no-input-rename */
  @Input('filter')
  public filterFunction: (item: ListItemModel, filter: any) => boolean;

  /**
   * Specifies the template for the filter. The template can access the `filter`
   * variable that contains the `value` of the filter control, which should be bound to
   * `ngModel`, and the `changed` function, which should be called when the model changes.
   * @required
   */
  @Input('template')
  public templateInput: TemplateRef<any>;
  /* tslint:enable:no-input-rename */

  public onChange: EventEmitter<any> = new EventEmitter<any>();

  @ContentChildren(TemplateRef)
  private templates: QueryList<TemplateRef<any>>;

  public ngOnInit() {
    if (this.name === undefined || this.name.length === 0) {
      throw new Error('Inline filter requires a name.');
    }
  }

  public get template(): TemplateRef<any> {
      return this.templates.length > 0 ? this.templates.first : this.templateInput;
  }
}
