import {
  Component,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  input,
  numberAttribute,
} from '@angular/core';

import { SkyAgGridFilterOperator } from '../types/sky-ag-grid-filter-operator';

@Component({
  selector: 'sky-ag-grid-column',
  template: '',
})
export class SkyAgGridColumnComponent {
  public readonly description = input<string>();
  public readonly field = input<string>();
  public readonly heading = input<string>();
  public readonly columnId = input<string>();

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   */
  public readonly helpPopoverTitle = input<string>();

  /**
   * The content of the help popover. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the column header. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title.
   */
  public readonly helpPopoverContent = input<string | TemplateRef<unknown>>();

  public readonly hidden = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly isSortable = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly locked = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly template = input<TemplateRef<unknown>>();
  public readonly type = input<'text' | 'number' | 'date' | 'boolean'>('text');
  public readonly width = input<number, unknown>(0, {
    transform: numberAttribute,
  });

  /**
   * The filter ID that maps this column to a filter bar item.
   * When set, changes to the corresponding filter will apply to this column.
   * Defaults to the column's `field` value.
   */
  public readonly filterId = input<string>();

  /**
   * The filter operator to use when applying the filter.
   * Defaults based on column type:
   * - text: 'contains'
   * - number: 'equals'
   * - date: 'equals'
   */
  public readonly filterOperator = input<SkyAgGridFilterOperator>();

  protected readonly templateChild = contentChild(TemplateRef);

  public readonly cellTemplate = computed<TemplateRef<unknown> | undefined>(
    () => {
      const template = this.template();
      const templateChild = this.templateChild();
      return template || templateChild;
    },
  );
}
